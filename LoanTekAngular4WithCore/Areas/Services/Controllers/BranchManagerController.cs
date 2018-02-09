using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace LoanTekAngular4WithCore.Areas.Services.Controllers
{
	[Area("Services")]
	public class BranchManagerController : Controller
	{
		public IActionResult Index()
{
			return View();
		}

		// public IActionResult GetAllBranches(int clientId) {}

		// public IActionResult GetNewBranchAssets() {}

		// public JsonResult GetBranch(int clientId, int branchId) {}

		// public JsonResult GetAllUsers(int clientId) {}

		// public JsonResult GetUsersWithNoBranch(int clientId) {}

		// public JsonResult DeleteUserFromBranch(int clientId, int branchId, int userId) {}

		// public JsonResult DeleteManagerFromBranch(int clientId, int branchId, int userId) {}

		// public JsonResult DeleteBranch(int clientId, int branchId) {}

		// public JsonResult GetPricingRules(int clientId) {}

		// public JsonResult Save(NewBranchModel model) {}

		// public JsonResult AddUsers(AddUsersModel model) {}

		// public JsonResult AddManagers(AddUsersModel model) {}
	}
}