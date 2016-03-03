
function SwitchboardData(){}

SwitchboardData.prototype.getSource = function (datasource)
{
	return this[datasource];
};

SwitchboardData.prototype.addSource = function (datasource,array)
{
	this[datasource] = new SwitchboardArray();
	this[datasource].push.apply(this[datasource],array);
};

function SwitchboardArray(){}

SwitchboardArray.prototype = new Array();

SwitchboardArray.prototype.setKey = function (key)
{
	this.id = key;
};

SwitchboardArray.prototype.lookup = function (key,value)
// SwitchboardArray.prototype.lookup = function (value)	// This function prototype is in effect overloaded.
{
	// ---- Implement Pseudo overloading ----
	if (arguments.length==1)
	{
		if (typeof this.id !== "undefined")
		{
			value = arguments[0];
			key = this.id;
		}
		else
		{
			throw new Error("No Key set for this datasource");
		}
	}
	// ------------

	for ( var index=0; index<this.length; index++)
	{
		if (this[index][key] == value)
		{
			return this[index];
		}
	}
	return false;
};
