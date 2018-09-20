odoo.define('anytracker.update_kanban', function (require) {
'use strict';

var KanbanRecord = require('web.KanbanRecord');

KanbanRecord.include({
    /**
     * lets mock addons/web/static/src/js/views/kanban/kanban_record.js _setState()
     * to add our context bindings
     */
    _setState: function (recordState) {
        this.state = recordState;
        this.id = recordState.res_id;
        this.db_id = recordState.id;
        this.recordData = recordState.data;
        this.record = this._transformRecord(recordState.data);
        this.qweb_context = {
            kanban_gravatar: this._get_kanban_gravatar_url.bind(this),

            kanban_image: this._getImageURL.bind(this),
            kanban_color: this._getColorClassname.bind(this),
            kanban_getcolor: this._getColorID.bind(this),
            kanban_compute_domain: this._computeDomain.bind(this),
            read_only_mode: this.read_only_mode,
            record: this.record,
            user_context: this.getSession().user_context,
            widget: this,
        };
    },

    /** get assignee gravatar url from email */
    _get_kanban_gravatar_url: function(email, size) {
        size = size || 22;
        email = _.str.trim(email || '').toLowerCase();
        var default_ = _.str.isBlank(email) ? 'mm' : 'identicon';
        var email_md5 = $.md5(email);
        return '//www.gravatar.com/avatar/' + email_md5 + '.png?s=' + size + '&d=' + default_;
    }
});

/*
var Model = required('web.Model');
var ViewManagerAction = require('web.ViewManagerAction');

ViewManagerAction.include({
    set_title: function() {
        this._super();
        // Replace the stupid Tickets title with the path to the active_id

        if (this.action.res_model == 'anytracker.ticket'
            && this.active_view == 'kanban'
            && this.action.context.active_id)
        {
            var id = this.action.context.active_id;
            var self = this;
            var tickets = new Model("anytracker.ticket");
            tickets.call('get_breadcrumb', [[id]]).done(function(result) {
                var breadcrumbs = [];
                for (var i=0; i < result.length; i++) {
                    breadcrumbs.push(_.str.sprintf(result[i].name))
                }
                var title = breadcrumbs.join(' / ');
                self.$el.find('.oe_breadcrumb_item:last').html(title);
            })
        }
    }
});
*/

return KanbanRecord;
});

