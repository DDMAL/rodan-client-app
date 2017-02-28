import $ from 'jquery';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import rodan from 'rodan-client-core';

/**
 * RunJob view.
 */
export default class ViewRunJob extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Set 'Open' button availability after render.
     *
     * @todo this is a hack to make sure the client shows what runjobs are manual and available
     */
    onRender()
    {
    	$(this.el).find('#button-open_runjob').prop('disabled', !this.model.available());
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle double-click.
     */
    _handleButtonOpen()
    {
        rodan.rodan_client_core.channel.request(rodan.rodan_client_core.events.REQUEST__RUNJOB_ACQUIRE, {runjob: this.model});
    }
}
ViewRunJob.prototype.modelEvents = {
    'all': 'render'
};
ViewRunJob.prototype.ui = {
    buttonOpen: '#button-open_runjob'
};
ViewRunJob.prototype.events = {
    'click @ui.buttonOpen': '_handleButtonOpen'
        };
ViewRunJob.prototype.template = '#template-main_runjob_individual';