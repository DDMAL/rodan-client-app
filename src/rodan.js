import Events from 'js/Events';
import RodanClientCore from 'rodan-client-core';

const Rodan = 
{
	AppEvents: Events,
	BaseModel: RodanClientCore.BaseModel,
	Configuration: RodanClientCore.config,
	CoreEvents: RodanClientCore.events,
	Environment: RodanClientCore.env,
	CoreChannel: RodanClientCore.channel
};

export default Rodan;