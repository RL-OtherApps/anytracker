# coding: utf-8
from openerp import models, fields, api, _
from openerp.exceptions import except_orm

class LinkType(models.Model):
    """Type of a link.
    """
    _name = 'anytracker.link.type'
    _order = 'name'

    name = fields.Char(
        'name',
        size=64,
        required=True,
        translate=True)
    description = fields.Text(
        'Description',
        translate=True)
    state = fields.Char(
        'state',
        size=64,
        required=True)
    linktype_id = fields.Many2one(
        'anytracker.link.type',
        'Reverse Link Type',
         required=False,
         ondelete='cascade')

class Link(models.Model):
    """Type of a link.
    """
    _name = 'anytracker.link'

    @api.one
    @api.depends('ticket_two')
    @api.onchange('ticket_two')
    def _data_ticket_two(self):
        for rec in self:
            self.stage = rec.ticket_two.stage_id.name if self.ticket_two else False
            self.progress = rec.ticket_two.progress if self.ticket_two else False
            self.number = rec.ticket_two.number if self.ticket_two else False

    ticket_one =  fields.Many2one(
        'anytracker.ticket',
        'Ticket one',
         required=True,
         ondelete='cascade')
    ticket_two =  fields.Many2one(
        'anytracker.ticket',
        'Ticket two',
         required=True,
         ondelete='cascade')

    linktype_id = fields.Many2one(
        'anytracker.link.type',
        'Type Link',
         required=False,
         ondelete='cascade')
    number = fields.Integer(compute='_data_ticket_two', string="")
    progress = fields.Float(compute='_data_ticket_two', string="")
    stage = fields.Char(compute='_data_ticket_two', string="")


class Ticket(models.Model):
    """ Add stage and progress functionality to tickets
    Progress is based on stages. Each stage has a progress,
    and the progress is copied on the ticket
    """

    _inherit = 'anytracker.ticket'

    link_ids = fields.One2many(
        'anytracker.link',
        'ticket_one',
        'Links',
        copy=True,
        help="The tickets linked to this tickets")