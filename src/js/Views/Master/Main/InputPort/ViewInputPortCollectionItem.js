import BaseViewCollectionItem from 'js/Views/Master/Main/BaseViewCollectionItem';
import Radio from 'backbone.radio';
import RodanClientCore from 'rodan-client-core';

/**
 * InputPort Collection Item view.
 */
export default class ViewInputPortCollectionItem extends BaseViewCollectionItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object; 'options.workflow' (Workflow) and 'options.workflowjob' (WorkflowJob) must also be provided
     */
    initialize(options)
    {
        this._workflow = options.workflow;
        this._workflowJob = options.workflowjob;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle delete.
     */
    _handleButtonDelete()
    {
        RodanClientCore.channel.request(RodanClientCore.events.REQUEST__WORKFLOWBUILDER_REMOVE_INPUTPORT, {inputport: this.model, workflow: this._workflow, workflowjob: this._workflowJob});
    }
}
ViewInputPortCollectionItem.prototype.ui = {
            buttonDelete: '#button-delete'
        };
ViewInputPortCollectionItem.prototype.events = {
            'click @ui.buttonDelete': '_handleButtonDelete'
        };
ViewInputPortCollectionItem.prototype.template = '#template-main_inputport_collection_item';
ViewInputPortCollectionItem.prototype.tagName = 'tr';