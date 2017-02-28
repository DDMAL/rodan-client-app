import Events from 'js/Events';
import Radio from 'backbone.radio';
import ViewNavigationNode from './ViewNavigationNode';

/**
 * This class represents a navigation menu node for a ResourceList.
 */
export default class ViewNavigationNodeResourceLists extends ViewNavigationNode
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     *
     * @param {object} options Marionette.View options object
     */
    initialize(options)
    {
        super.initialize(options);
        Radio.channel('rodan').on(Events.EVENT__RESOURCELIST_SELECTED_COLLECTION, options => this._handleEventResourceListsSelected(options));
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Send click events.
     */
    _sendClickEvents()
    {
        rodan.rodan_client_core.channel.request(rodan.rodan_client_core.events.REQUEST__PROJECT_SET_ACTIVE, {project: this.model.get('project')});
        Radio.channel('rodan').trigger(Events.EVENT__RESOURCELIST_SELECTED_COLLECTION, {project: this.model.get('project')});
    }

    /**
     * Handle highlighting.
     */
    _handleEventResourceListsSelected(options)
    {
        if (options.project === this.model.get('project'))
        {
            Radio.channel('rodan').trigger(Events.EVENT__NAVIGATION_SELECTED_NODE, {node: this});
        }
    }
}
ViewNavigationNodeResourceLists.prototype.template = '#template-navigation_resourcelists';