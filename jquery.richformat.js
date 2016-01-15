(function($) {
  function addPlugin(plugin) {
    $.fn[plugin.name] = function(runtimeOption) {
      var option = $.extend(plugin.option, runtimeOption);
      return this.each(function() {
        plugin.main.bind(this)(option);
      });
    };
  }

  addPlugin({
    name: "richformat",
    option: {
      format: function(value) {
        return value;
      },
      style: {}
    },
    main: function(option) {
      var styles = {
        wrapper: {
          position: "relative",
          display: "inline-block",
          width: "100%"
        },
        overlay: {
          position: "absolute",
          cursor: "text"
        }
      };
      var input = $(this);
      var inputTextHeight = input.height();
      var inputTextWidth = input.width();
      var inputBoxHeight = input.outerHeight();
      var inputBoxWidth = input.outerWidth();
      var inputBackgroundColor = input.css("backgroundColor");
      var inputFontSize = input.css("fontSize");
      var inputColor = input.css("color");
      var inputDisplay = input.css("display");
      var inputTextAlign = input.css("textAlign");
      var paddingY = (inputBoxHeight - inputTextHeight) / 2;
      var paddingX = (inputBoxWidth - inputTextWidth) / 2;
      var overlay = $("<div />")
        .css(styles.overlay)
        .css({
          height: inputTextHeight + "px",
          top: paddingY + "px",
          left: paddingX + "px",
          right: paddingX + "px",
          lineHeight: inputTextHeight + "px",
          backgroundColor: inputBackgroundColor,
          fontSize: inputFontSize,
          color: inputColor,
          textAlign: inputTextAlign
        })
        .css(option.style)
        .on("click", function() {
          input.focus();
        });
      var wrapper = $("<div />")
        .css(styles.wrapper)
        .css({
          width: inputBoxWidth + "px",
          display: inputDisplay
        })
        .on("dblclick", function() {
          overlay.click();
          input.select();
        });
      var changeRichValue = function(value) {
        var richValue = option.format(value);
        var method = $.type(richValue) === "object" ? "html" : "text";
        overlay[method](richValue);
      }

      input
        .wrap(wrapper)
        .before(overlay)
        .on("focus", function() {
          $(overlay).hide();
          var value = input.val();
          input.val("").val(value); // hack of move the cursor to the last position of input
        })
        .on("blur", function() {
          changeRichValue(input.val());
          $(overlay).show();
        });

      changeRichValue(input.val());
    }
  });
})(jQuery);
