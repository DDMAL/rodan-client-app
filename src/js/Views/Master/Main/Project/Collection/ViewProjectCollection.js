import BaseViewCollection from 'js/Views/Master/Main/BaseViewCollection';
import Radio from 'backbone.radio';
import rodan from 'rodan-client-core';
import ViewProjectCollectionItem from './ViewProjectCollectionItem';

/**
 * Project Collection view.
 */
export default class ViewProjectCollection extends BaseViewCollection
{
    _handleButtonNewProject()
    {
        var user = rodan.rodan_client_core.channel.request(rodan.rodan_client_core.events.REQUEST__AUTHENTICATION_USER);
        rodan.rodan_client_core.channel.request(rodan.rodan_client_core.events.REQUEST__PROJECT_CREATE, {creator: user});
    }
}

ViewProjectCollection.prototype.ui = {
    buttonNewProject: '#button-new_project'
};
ViewProjectCollection.prototype.events = {
    'click @ui.buttonNewProject': '_handleButtonNewProject'
};
ViewProjectCollection.prototype.template = '#template-main_project_collection';
ViewProjectCollection.prototype.childView = ViewProjectCollectionItem;
ViewProjectCollection.prototype.behaviors = {Table: {'table': '#table-projects'}};