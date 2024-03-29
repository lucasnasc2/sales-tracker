<template>
  <v-card color="primary" variant="tonal">
    <div class="d-flex flex-no-wrap justify-space-between">
      <v-avatar v-if="previewUrl" class="ma-3" rounded="0" size="125">
        <v-img :src="previewUrl"></v-img>
      </v-avatar>
      <v-avatar v-if="src && !previewUrl" class="ma-3" rounded="0" size="125">
        <v-img :src="src"></v-img>
      </v-avatar>
      <v-avatar v-if="!src && !previewUrl" class="ma-3" rounded="0" size="125">
        <v-icon>mdi-image-plus</v-icon>
      </v-avatar>

      <div style="align-self: end">
        <v-card-actions>
          <v-btn
            v-if="previewUrl || src"
            @click="discardFile"
            class="ms-2"
            size="small"
            variant="outlined"
          >
            descartar
          </v-btn>
          <v-btn
            v-else
            @click="openFileInput"
            class="ms-2"
            size="small"
            variant="outlined"
          >
            Pick file
          </v-btn>
        </v-card-actions>
      </div>
    </div>
  </v-card>
  <input
    type="file"
    accept="image/*"
    ref="fileInput"
    style="display: none"
    @change="handleFileInputChange"
  />
</template>

<script>
import { mapStores } from 'pinia';
import { useAlertStore } from '@/store/alerts';

export default {
  props: {
    src: {
      type: String,
    },
  },
  emits: ["imageUploaded", "fileDiscarded"],
  data() {
    return {
      file: null,
      previewUrl: null,
    };
  },
  computed: {
...mapStores(useAlertStore)
  },
  methods: {
    discardFile() {
      (this.file = null), (this.previewUrl = null);
      this.$refs.fileInput.value = null;
      this.$emit("fileDiscarded");
    },
    openFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileInputChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.file = file;
        this.previewImage();
      }
    },
    previewImage() {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        this.uploadImage();
      };
      reader.readAsDataURL(this.file);
    },
    uploadImage() {
      this.processFile()
        .then((compressedImage) => {
          this.$emit("imageUploaded", compressedImage);
        })
        .catch((error) => {
          console.error("Error processing the file:", error);
          this.alertStore.setAlert(error,"error",8)
          
        });
    },
    async processFile() {
      const image = new Image();
      const reader = new FileReader();

      const resizeAndCompress = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxSize = 300; // Max width or height in pixels

        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(image, 0, 0, width, height);

        return new Promise((resolve) => {
          canvas.toBlob(
            (blob) => {
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            },
            "image/jpeg",
            0.5
          ); // Compression quality (0.5 means 50%)
        });
      };

      reader.readAsDataURL(this.file);

      return new Promise((resolve) => {
        reader.onload = () => {
          image.src = reader.result;
          image.onload = async () => {
            const compressedImage = await resizeAndCompress();
            resolve(compressedImage);
          };
        };
      });
    },
  },
};
</script>
