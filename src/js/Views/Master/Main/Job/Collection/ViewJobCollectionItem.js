import BaseViewCollectionItem from 'js/Views/Master/Main/BaseViewCollectionItem';
import Radio from 'backbone.radio';
import RodanClientCore from 'rodan-client-core';

/**
 * View for Job item in Job Collection.
 */
export default class ViewJobCollectionItem extends BaseViewCollectionItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object; 'options.workflow' (Workflow) must also be provided for the associated Workflow
     */
    initialize(options)
    {
        this._workflow = options.workflow;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle add button.
     */
    _handleClickButtonAdd()
    {
        RodanClientCore.channel.request(RodanClientCore.events.REQUEST__WORKFLOWBUILDER_ADD_WORKFLOWJOB, {job: this.model, workflow: this._workflow});
    }
}
ViewJobCollectionItem.prototype.template = '#template-main_job_collection_item';
ViewJobCollectionItem.prototype.tagName = 'tr';
ViewJobCollectionItem.prototype.ui = {
    buttonAdd: '#button-main_job_button_add'
};
ViewJobCollectionItem.prototype.events = {
    'click @ui.buttonAdd': '_handleClickButtonAdd',
    'dblclick': '_handleClickButtonAdd'
};