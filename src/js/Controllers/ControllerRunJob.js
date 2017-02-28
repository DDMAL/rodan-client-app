import BaseController from './BaseController';
import Events from 'js/Events';
import LayoutViewModel from 'js/Views/Master/Main/LayoutViewModel';
import Radio from 'backbone.radio';
import RodanClientCore from 'rodan-client-core';
import ViewRunJob from 'js/Views/Master/Main/RunJob/Individual/ViewRunJob';
import ViewRunJobCollection from 'js/Views/Master/Main/RunJob/Collection/ViewRunJobCollection';
import ViewRunJobCollectionItem from 'js/Views/Master/Main/RunJob/Collection/ViewRunJobCollectionItem';

/**
 * Controller for RunJobs.
 */
export default class ControllerRunJob extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     */
    initialize()
    {
        this._runJobLocks = {};
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        Radio.channel('rodan').reply(Events.REQUEST__RUNJOB_SHOWLAYOUTVIEW, options => this._handleCommandShowLayoutView(options));
        Radio.channel('rodan').on(Events.EVENT__RUNJOB_SELECTED, options => this._handleEventItemSelected(options));
        Radio.channel('rodan').on(Events.EVENT__RUNJOB_SELECTED_COLLECTION, options => this._handleEventCollectionSelected(options));
    }

    /**
     * Handle show LayoutView.
     */
    _handleCommandShowLayoutView(options)
    {
        this._layoutView = options.layoutView;
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(options)
    {
        this._layoutView.showItem(new ViewRunJob({model: options.runjob}));
    }

    /**
     * Handle event collection selected.
     */
    _handleEventCollectionSelected(options)
    {
        var collection = new RodanClientCore.RunJobCollection();
        collection.fetch({data: {project: options.project.id}});
        RodanClientCore.channel.request(RodanClientCore.events.REQUEST__UPDATER_SET_COLLECTIONS, {collections: [collection]});
        this._layoutView = new LayoutViewModel();
        Radio.channel('rodan').request(Events.REQUEST__MAINREGION_SHOW_VIEW, {view: this._layoutView});
        var view = new ViewRunJobCollection({collection: collection,
                                       template: '#template-main_runjob_collection',
                                       childView: ViewRunJobCollectionItem});
        this._layoutView.showCollection(view);
    }
}