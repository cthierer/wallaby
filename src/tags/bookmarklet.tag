<wallaby-bookmarklet>
  <a class="button hvr-bounce-to-bottom" onclick={ ignore } href="javascript:(function()\{ var s = document.createElement('script'); s.src = '{ source }'; document.body.appendChild(s); \})();">
    <yield>
  </a>
  <script type="es6">
    const srcStr = this.wallaby.config.app_src || ''
    this.source = srcStr.startsWith('http') || srcStr.startsWith('//')
      ? srcStr
      : `${this.wallaby.config.base_uri}${srcStr}`

      this.ignore = (e) => {
        e.preventDefault()
        return false
      }
  </script>
</wallaby-bookmarklet>
