import Events from 'js/Events';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import RodanClientCore from 'rodan-client-core';

/**
 * WorkflowJobGroup view.
 */
export default class ViewWorkflowJobGroup extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object; 'options.workflow' (Workflow) and 'options.workflowjobgroup' (WorkflowJobGroup) must also be provided
     */
    initialize(options)
    {
        this._workflow = options.workflow;
        /** @ignore */
        this.model = options.workflowjobgroup;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle button delete.
     */
    _handleButtonDelete()
    {
        Radio.channel('rodan').request(Events.REQUEST__MODAL_HIDE);
        RodanClientCore.channel.request(RodanClientCore.events.REQUEST__WORKFLOWJOBGROUP_DELETE, {workflowjobgroup: this.model, workflow: this._workflow});
    }

    /**
     * Handle button ungroup.
     *
     * @todo this shouldn't be calling the workflowbuilder
     */
    _handleButtonUngroup()
    {
        Radio.channel('rodan').request(Events.REQUEST__MODAL_HIDE);
        RodanClientCore.channel.request(RodanClientCore.events.REQUEST__WORKFLOWBUILDER_UNGROUP_WORKFLOWJOBGROUP, {workflowjobgroup: this.model, workflow: this._workflow});
    }

    /**
     * Handle button save.
     */
    _handleButtonSave()
    {
        Radio.channel('rodan').request(Events.REQUEST__MODAL_HIDE);
        this.model.set({name: this.ui.textName.val()});
        RodanClientCore.channel.request(RodanClientCore.events.REQUEST__WORKFLOWJOBGROUP_SAVE, {workflowjobgroup: this.model});
    }
}
ViewWorkflowJobGroup.prototype.template = '#template-main_workflowjobgroup';
ViewWorkflowJobGroup.prototype.ui = {
    buttonSave: '#button-save_workflowjobgroup_data',
    buttonDelete: '#button-delete_workflowjobgroup',
    buttonUngroup: '#button-ungroup_workflowjobgroup',
    textName: '#text-workflowjobgroup_name'
};
ViewWorkflowJobGroup.prototype.events = {
    'click @ui.buttonSave': '_handleButtonSave',
    'click @ui.buttonDelete': '_handleButtonDelete',
    'click @ui.buttonUngroup': '_handleButtonUngroup'
};