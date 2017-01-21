<core-icon>
  <core-raw html={ getSVG() || opts.alt } aria-text={ opts.alt } aria-hidden="true"></core-raw>
  <script type="es6">
    const icons = riot.mixin('icons')

    this.icon = icons[opts.name]

    this.on('update', () => {
      this.icon = icons[opts.name]
    })

    this.getSVG = () => {
      if (!this.icon) {
        return null
      }

      return this.icon.toSVG({
        class: 'core-icon',
        height: opts.height,
        width: opts.width
      })
    }
  </script>
</core-icon>
