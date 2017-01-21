<core-notification>
  <div class="notification { error: opts.type === 'error', info: opts.type === 'info' }">
    <button class="close" onclick={ close }>
      <core-icon name="x" alt="close" height="24px" width="24px"></core-icon>
    </button>
    <div class="icon" if={ opts.type === 'error' || opts.type === 'info' }>
      <core-icon name="{ opts.type === 'error' ? 'stop' : 'check' }" height="32px" width="32px"></core-icon>
    </div>
    <div class="message">
      { opts.message }
    </div>
  </div>
  <style scoped>
    .notification {
      position: fixed;
      top: 0;
      left: 0;
      width: 90%;
      margin: 0 5%;
      border-width: 1px;
      border-style: solid;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      padding: 8px;
      z-index: 1000;
      cursor: default;
    }

    .notification.info {
      color: #31708f;
      background-color: #d9edf7;
      border-color: #bcdff1;
    }

    .notification.info svg.core-icon {
      fill: #31708f;
    }

    .notification.error {
      color: #a94442;
      background-color: #f2dede;
      border-color: #ebcccc;
    }

    .notification.error svg.core-icon {
      fill: #a94442;
    }

    .notification .close {
      float: right;
      background-color: transparent;
      border: none;
      padding: 5px;
      width: 28px;
      height: 28px;
      text-align: center;
      vertical-align: middle;
      line-height: 32px;
    }

    .notification .icon,
    .notification .message {
      display: inline-block;
      line-height: 32px;
      vertical-align: middle;
    }

    .notification .icon {
      margin-right: 8px;
    }

    @media (min-width: 768px) {
      .notification {
        width: 60%;
        margin: 0 24%;
      }
    }
  </style>
  <script type="es6">
    this.on('mount', () => {
      setTimeout(() => this.close(), 30000)
    })

    this.close = () => this.unmount()
  </script>
</core-notification>
