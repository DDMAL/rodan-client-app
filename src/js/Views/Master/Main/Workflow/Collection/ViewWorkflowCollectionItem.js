import BaseViewCollectionItem from 'js/Views/Master/Main/BaseViewCollectionItem';
import Events from 'js/Events';
import Radio from 'backbone.radio';
import RodanClientCore from 'rodan-client-core';

/**
 * View for Workflow Collection.
 */
export default class ViewWorkflowCollectionItem extends BaseViewCollectionItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles click.
     */
    _handleClick()
    {
        Radio.channel('rodan').trigger(Events.EVENT__WORKFLOW_SELECTED, {workflow: this.model});
    }

    /**
     * Handle double-click.
     */
    _handleDoubleClick()
    {
        RodanClientCore.channel.trigger(RodanClientCore.events.EVENT__WORKFLOWBUILDER_SELECTED, {workflow: this.model});
    }
}
ViewWorkflowCollectionItem.prototype.template = '#template-main_workflow_collection_item';
ViewWorkflowCollectionItem.prototype.tagName = 'tr';
ViewWorkflowCollectionItem.prototype.events = {
    'click': '_handleClick',
    'dblclick': '_handleDoubleClick'
};