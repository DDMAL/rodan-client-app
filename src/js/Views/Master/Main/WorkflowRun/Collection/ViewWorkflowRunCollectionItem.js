import BaseViewCollectionItem from 'js/Views/Master/Main/BaseViewCollectionItem';
import Events from 'js/Events';
import Radio from 'backbone.radio';

/**
 * WorkflowRun Collection item view.
 */
export default class ViewWorkflowRunCollectionItem extends BaseViewCollectionItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles double click.
     */
    _handleDoubleClick()
    {
        Radio.channel('rodan').trigger(Events.EVENT__WORKFLOWRUN_SELECTED, {workflowrun: this.model});
    }
}
ViewWorkflowRunCollectionItem.prototype.template = '#template-main_workflowrun_collection_item';
ViewWorkflowRunCollectionItem.prototype.tagName = 'tr';
ViewWorkflowRunCollectionItem.prototype.events = {
    'dblclick': '_handleDoubleClick'
};