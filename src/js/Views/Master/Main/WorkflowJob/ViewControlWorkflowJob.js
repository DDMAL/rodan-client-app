import Events from 'js/Events';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import RodanClientCore from 'rodan-client-core';

/**
 * View for editing WorkflowJob.
 */
export default class ViewControlWorkflowJob extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object; 'options.workflow' (Workflow) must also be provided
     */
    initialize(options)
    {
        this._workflow = options.workflow;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle save button.
     */
    _handleButtonSave()
    {
        Radio.channel('rodan').request(Events.REQUEST__MODAL_HIDE);
        this.model.set({'name': this.ui.textName.val()});
        RodanClientCore.channel.request(RodanClientCore.events.REQUEST__WORKFLOWJOB_SAVE, {workflowjob: this.model});
    }

    /**
     * Handle delete button.
     */
    _handleButtonDelete()
    {
        RodanClientCore.channel.request(RodanClientCore.events.REQUEST__WORKFLOWBUILDER_REMOVE_WORKFLOWJOB, {workflowjob: this.model, workflow: this._workflow});
        Radio.channel('rodan').request(Events.REQUEST__MODAL_HIDE);
    }
}
ViewControlWorkflowJob.prototype.template = '#template-main_workflowjob';
ViewControlWorkflowJob.prototype.ui = {
    buttonSave: '#button-save_workflowjob_data',
    buttonDelete: '#button-delete_workflowjob',
    textName: '#text-workflowjob_name'
};
ViewControlWorkflowJob.prototype.events = {
    'click @ui.buttonSave': '_handleButtonSave',
    'click @ui.buttonDelete': '_handleButtonDelete'
};