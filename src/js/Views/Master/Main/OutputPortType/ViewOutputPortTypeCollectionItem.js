import BaseViewCollectionItem from 'js/Views/Master/Main/BaseViewCollectionItem';
import Radio from 'backbone.radio';
import RodanClientCore from 'rodan-client-core';

/**
 * OutputPortType Collection item view.
 */
export default class ViewOutputPortTypeCollectionItem extends BaseViewCollectionItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object; 'options.workflowjob' (WorkflowJob) and 'options.workflow' (Workflow) must also be provided
     */
    initialize(options)
    {
        this._workflowJob = options.workflowjob;
        this._workflow = options.workflow;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles output port add.
     */
    _handleButtonNewOutputPort()
    {
        RodanClientCore.channel.request(RodanClientCore.events.REQUEST__WORKFLOWBUILDER_ADD_OUTPUTPORT, {outputporttype: this.model, workflowjob: this._workflowJob, workflow: this._workflow});
    }
}
ViewOutputPortTypeCollectionItem.prototype.tagName = 'tr';
ViewOutputPortTypeCollectionItem.prototype.template = '#template-main_outputporttype_collection_item';
ViewOutputPortTypeCollectionItem.prototype.events = {
    'click @ui.buttonNewOutputPort': '_handleButtonNewOutputPort'
};
ViewOutputPortTypeCollectionItem.prototype.ui = {
    buttonNewOutputPort: '#button-new_outputport'
};