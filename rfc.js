var mainModule = function module(){
	this.mainController = {
		// Shared scope variables and functions. (closures)
		navController: function(){
			console.log('show me some controller');
		},
		asideController: function(){

		},
		articleController: function(){

		}
	},
	this.mainService = {
		// Shared scope variables and functions. (closures)
		navService: function(){
			console.log('show me some service');
		},
		asideService:function(){

		},
		articleService: function(){

		}
	}
};

var navModule = function navModule(controller, service){
	// Nav scope variables and functions. (closures)
	this.navController = controller,
	this.navService = service
};
var asideModule = function asideModule(controller, service){
	// Aside scope variables and functions. (closures)
	this.asideController = controller,
	this.asideService = service
};
var articleModule = function articleModule(controller, service){
	// Article scope variables and functions. (closures)
	this.articleController = controller,
	this.articleService = service
};

// Entry point.
function setup(){
	mainModule = new mainModule;
	var mainController = mainModule.mainController;
	var mainService = mainModule.mainService;
	navModule = new navModule(mainController.navController, mainService.navService);
	asideModule = new asideModule(mainController.asideController, mainService.asideService);
	articleModule = new articleModule(mainController.articleController, mainService.articleService);
}
setup();

