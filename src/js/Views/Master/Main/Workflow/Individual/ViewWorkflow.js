import Marionette from 'backbone.marionette';
import Events from 'js/Events';
import Radio from 'backbone.radio';
import RodanClientCore from 'rodan-client-core';

/**
 * Workflow view.
 */
export default class ViewWorkflow extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle button run workflow.
     */
    _handleButtonRunWorkflow()
    {
        RodanClientCore.channel.trigger(RodanClientCore.events.EVENT__WORKFLOWBUILDER_CREATE_WORKFLOWRUN, {workflow: this.model});
    }

    /**
     * Handle button delete workflow.
     */
    _handleButtonDeleteWorkflow()
    {
        RodanClientCore.channel.request(RodanClientCore.events.REQUEST__WORKFLOW_DELETE, {workflow: this.model});
    }

    /**
     * Handle button edit workflow.
     */
    _handleButtonEditWorkflow()
    {
        RodanClientCore.channel.trigger(RodanClientCore.events.EVENT__WORKFLOWBUILDER_SELECTED, {workflow: this.model});
    }

    /**
     * Handle button copy workflow.
     */
    _handleButtonCopyWorkflow()
    {
    }

    /**
     * Handle button export workflow.
     */
    _handleButtonExport()
    {
        RodanClientCore.channel.request(RodanClientCore.events.REQUEST__WORKFLOW_EXPORT, {workflow: this.model});
    }

    /**
     * Handle save button.
     */
    _handleButtonSave()
    {
        RodanClientCore.channel.request(RodanClientCore.events.REQUEST__WORKFLOW_SAVE, {workflow: this.model, fields: {name: this.ui.textName.val(), description: this.ui.textDescription.val()}});
    }
}
ViewWorkflow.prototype.modelEvents = {
            'all': 'render'
        };
ViewWorkflow.prototype.ui = {
    runWorkflowButton: '#button-run_workflow',
    deleteWorkflowButton: '#button-delete_workflow',
    copyWorkflowButton: '#button-copy_workflow',
    exportWorkflowButton: '#button-export_workflow',
    editWorkflowButton: '#button-edit_workflow',
    buttonSaveData: '#button-save_workflow_data',
    buttonSave: '#button-save_workflow',
    textName: '#text-workflow_name',
    textDescription: '#text-workflow_description'
        };
ViewWorkflow.prototype.events = {
    'click @ui.runWorkflowButton': '_handleButtonRunWorkflow',
    'click @ui.deleteWorkflowButton': '_handleButtonDeleteWorkflow',
    'click @ui.editWorkflowButton': '_handleButtonEditWorkflow',
    'click @ui.copyWorkflowButton': '_handleButtonCopyWorkflow',
    'click @ui.buttonSaveData': '_handleButtonSave',
    'click @ui.buttonSave': '_handleButtonSave',
    'click @ui.exportWorkflowButton': '_handleButtonExport'
        };
ViewWorkflow.prototype.template = '#template-main_workflow_individual';