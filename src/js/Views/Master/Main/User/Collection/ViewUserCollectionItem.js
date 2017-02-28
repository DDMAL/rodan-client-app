import BaseViewCollectionItem from 'js/Views/Master/Main/BaseViewCollectionItem';
import Radio from 'backbone.radio';
import RodanClientCore from 'rodan-client-core';

/**
 * Item view for User Collection.
 */
export default class ViewUserCollectionItem extends BaseViewCollectionItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object; 'options.project' (Project) must also be provided for the associated Project; if 'options.admin' is true, user treated as Project 'admin', else 'worker'
     */
    initialize(options)
    {
        this._project = options.project;
        this._removeEvent = options.admin ? RodanClientCore.events.REQUEST__PROJECT_REMOVE_USER_ADMIN : RodanClientCore.events.REQUEST__PROJECT_REMOVE_USER_WORKER;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle remove button.
     */
    _handleClickButtonRemove()
    {
        RodanClientCore.channel.request(this._removeEvent, {user: this.model, project: this._project});
    }
}
ViewUserCollectionItem.prototype.ui = {
    buttonRemove: '#button-main_project_remove_user'
};
ViewUserCollectionItem.prototype.events = {
    'click @ui.buttonRemove': '_handleClickButtonRemove'
};