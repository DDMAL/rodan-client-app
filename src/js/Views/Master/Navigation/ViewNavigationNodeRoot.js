import Events from 'js/Events';
import Radio from 'backbone.radio';
import ViewNavigationNode from './ViewNavigationNode';
import ViewNavigationNodeProject from './ViewNavigationNodeProject';

/**
 * This class represents a navigation menu node.
 */
export default class ViewNavigationNodeRoot extends ViewNavigationNode
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * This hides all subviews on render (initially).
     */
    onRender()
    {
        this._showSubviews();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Send click events.
     */
    _sendClickEvents()
    {
        Radio.channel('rodan').trigger(Events.EVENT__PROJECT_SELECTED_COLLECTION);
    }
}
ViewNavigationNodeRoot.prototype.ui = {
    text: '.node_text'
};
ViewNavigationNodeRoot.prototype.events = {
    'click @ui.text': '_handleClick'
};
ViewNavigationNodeRoot.prototype.template = '#template-navigation_root';
ViewNavigationNodeRoot.prototype.childView = ViewNavigationNodeProject;
