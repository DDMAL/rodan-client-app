import Events from 'js/Events';
import Radio from 'backbone.radio';
import RodanClientCore from 'rodan-client-core';
import ViewNavigationNode from './ViewNavigationNode';

/**
 * This class represents a navigation menu node for RunJobs.
 */
export default class ViewNavigationNodeRunJobs extends ViewNavigationNode
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
        Radio.channel('rodan').on(Events.EVENT__RUNJOB_SELECTED_COLLECTION, options => this._handleEventCollectionSelected(options));
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Send click events.
     */
    _sendClickEvents()
    {
        RodanClientCore.channel.request(RodanClientCore.events.REQUEST__PROJECT_SET_ACTIVE, {project: this.model.get('project')});
        Radio.channel('rodan').trigger(Events.EVENT__RUNJOB_SELECTED_COLLECTION, {project: this.model.get('project')});
    }

    /**
     * Handle highlighting.
     */
    _handleEventCollectionSelected(options)
    {
        if (options.project === this.model.get('project'))
        {
            Radio.channel('rodan').trigger(Events.EVENT__NAVIGATION_SELECTED_NODE, {node: this});
        }
    }
}
ViewNavigationNodeRunJobs.prototype.template = '#template-navigation_runjobs';