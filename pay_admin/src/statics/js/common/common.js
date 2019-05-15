$(function() {
    class common {
        /**
         * 加载头部、左侧导航栏
         */
        common_html() {
            $('head').append(`<link rel="import" href="${this.getContextPath()}/components/common/header.html" id ="header">`)
            $('head').append(`<link rel="import" href="${this.getContextPath()}/components/common/leftnav.html" id ="left">`)
            setTimeout(() => {
                // 添加头部导航栏
                $('head').append($('#header')[0].import.querySelector('script'));
                $('#header-nav').html(template('header_nav'))

                // 添加左侧导航栏
                $('head').append($('#left')[0].import.querySelector('script'));
                $('#left-nav').html(template('left_nav'))
            }, 200)
            
            this.show_msg();
        }

        /**
         * 获取绝对路径
         */
        getContextPath() {
            var pathName = document.location.pathname;
            var index = pathName.substr(1).indexOf("/");
            var result = pathName.substr(0, index + 1);
            return result;
        }
        
        /**
         * 消息管理提示消息
         */
        show_msg() {
            $('body').on('click', '#msg_tips_show', (e) => {
                $('.am-dropdown-content').toggle(100);
                stopproPagation(e);
            })
            $('body').on('click', () => {
                $('.am-dropdown-content').hide(100);
            })
        }

        init() {
            this.common_html();
        }
    }

    const common_js = new common();
    common_js.init();
})