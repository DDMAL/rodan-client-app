import $ from 'jquery';
import BaseController from './BaseController';
import Events from 'js/Events';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * Controls modals.
 */
export default class ControllerModal extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     */
    initialize()
    {
        this._waiting = true;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
        // Requests.
        Radio.channel('rodan').reply(Events.REQUEST__MODAL_ERROR, (options) => this._handleRequestModalError(options));
        Radio.channel('rodan').reply(Events.REQUEST__MODAL_HIDE, () => this._handleRequestModalHide());
        Radio.channel('rodan').reply(Events.REQUEST__MODAL_SHOW, options => this._handleRequestModalShow(options));
        Radio.channel('rodan').reply(Events.REQUEST__MODAL_SHOW_IMPORTANT, options => this._handleRequestModalShowImportant(options));
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle request modal hide.
     */
    _handleRequestModalHide()
    {
        var $modalElement = $('#modal-generic');
        $('.modal-footer').removeClass('modal-footer-error');
        $modalElement.modal('hide');
        this._waiting = false;
    }

    /**
     * Handle request modal show.
     */
    _handleRequestModalShow(options)
    {
        var $modalEl = $('#modal-generic');
        if ($modalEl.is(':visible'))
        {
            return;
        }

        if (typeof options.content == 'string')
        {
            this._layoutViewModal = new Marionette.LayoutView({template: '#template-modal_simple'});
            this._layoutViewModal.render();

            $modalEl.css({top: 0, left: 0, position: 'absolute'});
            $modalEl.html(this._layoutViewModal.el);
            $('.modal-title').text(options.title);
            $('.modal-body').append(options.content);
            $modalEl.modal({backdrop: 'static', keyboard: false}); 
        }
        else
        {
            this._layoutViewModal = new Marionette.LayoutView({template: '#template-modal'});
            this._layoutViewModal.addRegions({modal_body: '#region-modal_body'});
            this._layoutViewModal.render();
            this._layoutViewModal.getRegion('modal_body').show(options.content);

            $modalEl.css({top: 0, left: 0, position: 'absolute'});
            $modalEl.html(this._layoutViewModal.el);
            $modalEl.draggable({handle: '.modal-header'});
            $('.modal-title').text(options.title);
            $modalEl.modal({backdrop: 'static'});
        }
    }

    /**
     * Handles modal update footer. If a modal is currently visible, this will
     * update the footer. If not, it will do REQUEST__MODAL_SHOW.
     */
    _handleRequestModalShowImportant(options)
    {
        var $modalEl = $('#modal-generic');
        if ($modalEl.is(':visible'))
        {
            $('.modal-footer').text(options.tltle + ': ' + options.content); 
        }
        else
        {
            Radio.channel('rodan').request(Events.REQUEST__MODAL_SHOW, options);
        }
    }

    /**
     * Handles modal error. If modal is already visible, changes footer text.
     * Else, creates simple modal.
     */
    _handleRequestModalError(options)
    {
        var $modalEl = $('#modal-generic');
        if ($modalEl.is(':visible'))
        {
            $('.modal-footer').text(options.content); 
        }
        else
        {
            Radio.channel('rodan').request(Events.REQUEST__MODAL_SHOW, {title: 'ERROR', content: options.content});
        }
        $('.modal-footer').addClass('modal-footer-error');
    }
}