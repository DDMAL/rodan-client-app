import BaseViewCollectionItem from 'js/Views/Master/Main/BaseViewCollectionItem';
import Events from 'js/Events';
import Radio from 'backbone.radio';
import RodanClientCore from 'rodan-client-core';

/**
 * Item view for Resource Collection.
 */
export default class ViewResourceCollectionItem extends BaseViewCollectionItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles click.
     */
    _handleClick()
    {
        Radio.channel('rodan').trigger(Events.EVENT__RESOURCE_SELECTED, {resource: this.model});
    }

    /**
     * Handles double click.
     */
    _handleDblClick()
    {
        RodanClientCore.channel.request(RodanClientCore.events.REQUEST__RESOURCE_DOWNLOAD, {resource: this.model});
    }
}
ViewResourceCollectionItem.prototype.template = '#template-main_resource_collection_item';
ViewResourceCollectionItem.prototype.tagName = 'tr';
ViewResourceCollectionItem.prototype.events = {
    'click': '_handleClick',
    'dblclick': '_handleDblClick'
};