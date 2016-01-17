(function($) {
  var Plugin = function(elem, options) {
    this.options = options;
    this.elem = elem;
  };
  Plugin.prototype = {
    defaults: {
      format: function(value) {
        return value;
      },
      style: {}
    },
    init: function() {
      this.config = $.extend({}, this.defaults, this.options);
      this.run();
      return this;
    },
    run: function() {
      var styles = {
        wrapper: {
          position: "relative",
          display: "inline-block",
          width: "100%"
        },
        overlay: {
          position: "absolute",
          cursor: "text",
          zIndex: 1
        }
      };
      var input = $(this.elem);
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
        .css(this.config.style)
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
        var richValue = this.config.format(value);
        var method = $.type(richValue) === "object" ? "html" : "text";
        overlay[method](richValue);
      }.bind(this);

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
  };

  $.fn.richformat = function(options) {
    return this.each(function() {
      new Plugin(this, options).init();
    });
  };
})(jQuery);
