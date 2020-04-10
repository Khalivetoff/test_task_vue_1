<template>
  <div class="notification-wrapper">
    <div class="layout">
      <div
        class="notification__item"
        :class="type_notif"
        v-for="(value, key) in notif_data"
        :key="key"
        @click="handDeleteNotifItem(key)"
      >
        {{ value }}
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                notif_data: {},
                notification_id_arr: [],
                type_notif: ''
            }
        },
        methods: {
            handDeleteNotifItem(key) {
                this.$delete(this.notif_data, key);
                this.notification_id_arr = this.notification_id_arr.filter(item => {
                    return item !== key;
                })
            }
        },
        mounted() {
            this.$root.$on('notification', (val, type) => {
                let id = 0;
                while (this.notification_id_arr.includes(id)) {
                    id++;
                }
                this.type_notif = type;
                this.notification_id_arr.push(id);
                this.$set(this.notif_data, id, val);
                setTimeout(() => {
                    this.$delete(this.notif_data, id);
                    this.notification_id_arr = this.notification_id_arr.filter(item => {
                        return item !== id;
                    })
                }, 3000);
            })
        }
    }
</script>
<style scoped>
  .notification-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .layout {
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .notification__item {
    height: auto;
    padding: 8px 16px;
    max-width: 300px;
    margin: 3px;
    border-radius: 9px;
    color: #fff;
    z-index: 100;
    cursor: pointer;
    user-select: none;
  }

  .notification__item.error {
    background: #e5539a;
  }

  .notification__item.success {
    background: #55bd91;
  }
</style>
