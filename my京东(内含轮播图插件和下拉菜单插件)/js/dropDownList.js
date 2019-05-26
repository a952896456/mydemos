
(function () {
    function Dropdown(options) {
        this.href = options.href;
        this.wrap = options.wrap;
        this.title = options.title || '';
        this.menuList = options.menuList || [];
        this.menuListLen = this.menuList.length;
        this.width = options.width;
        this.direction = options.direction || 'y';
        this.creatDom();
        this.initStyle();
        this.bindEvent();
    }

    Dropdown.prototype.creatDom = function () {
        $(this.wrap).append($('<a class="dropdown-btn" href=" ' + this.href + ' "> ' + this.title + ' </a>'));
        var dropDownDiv = $('<div class="my-dropdown"></div>');
        for (var i = 0; i < this.menuListLen; i++) {
            var menu = this.menuList[i];
            var dl = $('<dl></dl>');
            if (menu.title) {
                $('<dt>' + menu.title + '</dt>').appendTo(dl);
            }
            menu.items.forEach(function (item) {
                $('<dd> ' + item.name + ' </dd>').appendTo(dl);
            })
            dropDownDiv.append(dl);
        }
        dropDownDiv.appendTo($(this.wrap));
    }

    Dropdown.prototype.initStyle = function () {
        $(this.wrap).css({
            position: 'relative',
        }).find('.my-dropdown').css({
            position: 'absolute',
            backgroundColor: '#fff',
            border: '1px solid #eee',
            paddingLeft: 10,
            display: 'none',
        }).find('dl').css({
            width: (this.width + 10) * 2,
            // padding: '10px',
            //boxSizing: 'border-box',
            overflow: 'hidden',
            borderBottom: '1px solid #eee',
        }).find('dd').css({
            width: this.width,
            float: 'left',
            textAlign: 'left',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
        })
        $('.my-dropdown', $(this.wrap)).find('dt').css({
            textAlign: 'left',
            fontWeight: 700,
            color: '#666',
        })
        if(this.direction == 'x') {
            $('.my-dropdown', $(this.wrap)).css({
                width: 1190,
                right: -84,
            });
            var self = this;
            $('.my-dropdown > dl', $(this.wrap)).each(function (index) {
                $(this).css({
                    width: self.menuList[index].width,
                    float: 'left',
                    borderRight: '1px solid #eee',
                    padding: 10
                }).find('dd').css({
                    width: self.menuList[index].itemWidth,
                })
            })
        }
    }

    Dropdown.prototype.bindEvent = function () {
        $('.dropdown-btn').hover(function () {
            $(this).css({
                color: 'red',
            })
        }, function () {
            $(this).css({
                color: '#999',
            })
        })
        $(this.wrap).hover(function () {
            $(this).find('.dropdown-btn').css({
                backgroundColor: '#fff',
                borderColor: '#eee',
                borderBottomColor: '#fff',
            })
            $('.my-dropdown', $(this)).show();
        }, function () {
            $(this).find('.dropdown-btn').css({
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                borderBottomColor: 'transparent',
            })
            $('.my-dropdown', $(this)).hide();
        })
        $('.my-dropdown > dl > dd').hover(function () {
            $(this).css({
                color: 'red',
            })
        }, function () {
            $(this).css({
                color: '#999',
            })
        })
    }





    $.fn.extend({
        addDropdown: function (options) {
            options.wrap = $(this) || $('body');
            new Dropdown(options);
            return this;
        }
    })
}())