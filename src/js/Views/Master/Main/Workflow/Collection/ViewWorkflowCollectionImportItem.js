import BaseViewCollectionItem from 'js/Views/Master/Main/BaseViewCollectionItem';
import Radio from 'backbone.radio';

/**
 * Workflow Collection item for importing into another Workflow.
 */
export default class ViewWorkflowCollectionImportItem extends BaseViewCollectionItem
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
    _handleButtonImportWorkflow()
    {
        rodan.rodan_client_core.channel.request(rodan.rodan_client_core.events.REQUEST__WORKFLOWBUILDER_IMPORT_WORKFLOW, {origin: this.model, target: this._workflow});
    }
}
ViewWorkflowCollectionImportItem.prototype.template = '#template-main_workflowbuilder_workflow_collection_item_import';
ViewWorkflowCollectionImportItem.prototype.tagName = 'tr';
ViewWorkflowCollectionImportItem.prototype.ui = {
    buttonImportWorkflow: '#button-main_workflowbuilder_workflow_import'
};
ViewWorkflowCollectionImportItem.prototype.events = {
    'click @ui.buttonImportWorkflow': '_handleButtonImportWorkflow',
    'dblclick': '_handleButtonImportWorkflow'
};