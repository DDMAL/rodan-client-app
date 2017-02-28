import BaseViewCollectionItem from 'js/Views/Master/Main/BaseViewCollectionItem';
import Radio from 'backbone.radio';
import RodanClientCore from 'rodan-client-core';

/**
 * Resource item View for Collection in modal.
 */
export default class ViewResourceCollectionModalItem extends BaseViewCollectionItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object; 'options.assigned' (boolean; true iff this item belongs to the "assigned" Collection), options.requestdata (object; data sent with requests), options.assignrequest (object; when item becomes assigned, this request is sent), options.unassignrequest (object; when item becomes unassigned, this request is sent)
     */
    initialize(options)
    {
        this._assigned = options.assigned;
        this._requestData = options.requestdata;
        this._assignRequest = options.assignrequest;
        this._unassignRequest = options.unassignrequest;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles double click.
     */
    _handleDoubleClick()
    {
        this._requestData.resource = this.model;
        if (this._assigned)
        {
            RodanClientCore.channel.request(this._unassignRequest, this._requestData); 
        }
        else
        {
            RodanClientCore.channel.request(this._assignRequest, this._requestData); 
        }
    }
}
ViewResourceCollectionModalItem.prototype.template = '#template-modal_resource_collection_item';
ViewResourceCollectionModalItem.prototype.tagName = 'tr';
ViewResourceCollectionModalItem.prototype.events = {'dblclick': '_handleDoubleClick'};