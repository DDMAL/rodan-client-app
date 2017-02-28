import BaseController from './BaseController';
import Events from 'js/Events';
import LayoutViewModel from 'js/Views/Master/Main/LayoutViewModel';
import Radio from 'backbone.radio';
import RodanClientCore from 'rodan-client-core';
import ViewResource from 'js/Views/Master/Main/Resource/Individual/ViewResource';
import ViewResourceCollection from 'js/Views/Master/Main/Resource/Collection/ViewResourceCollection';
import ViewResourceCollectionItem from 'js/Views/Master/Main/Resource/Collection/ViewResourceCollectionItem';

/**
 * Controller for Resources.
 */
export default class ControllerResource extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        Radio.channel('rodan').on(Events.EVENT__RESOURCE_SELECTED_COLLECTION, options => this._handleEventCollectionSelected(options));
        Radio.channel('rodan').on(Events.EVENT__RESOURCE_SELECTED, options => this._handleEventItemSelected(options));
        Radio.channel('rodan').reply(Events.REQUEST__RESOURCE_SHOWLAYOUTVIEW, options => this._handleCommandShowLayoutView(options));
    }
   
    /**
     * Handle show LayoutView.
     */
    _handleCommandShowLayoutView(options)
    {
        this._layoutView = options.layoutView;
    }

    /**
     * Handle collection selection.
     */
    _handleEventCollectionSelected(options)
    {
        var collection = new RodanClientCore.ResourceCollection();
        collection.fetch({data: {project: options.project.id}});
        RodanClientCore.channel.request(RodanClientCore.events.REQUEST__RESOURCES_LOAD, {data: {project: options.project.id}});
        RodanClientCore.channel.request(RodanClientCore.events.REQUEST__UPDATER_SET_COLLECTIONS, {collections: [collection]});
        this._layoutView = new LayoutViewModel();
        Radio.channel('rodan').request(Events.REQUEST__MAINREGION_SHOW_VIEW, {view: this._layoutView});
        var view = new ViewResourceCollection({collection: collection,
                                         template: '#template-main_resource_collection',
                                         childView: ViewResourceCollectionItem,
                                         model: options.project});
        this._layoutView.showCollection(view);
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(options)
    {
        this._layoutView.showItem(new ViewResource({model: options.resource}));
    }
}