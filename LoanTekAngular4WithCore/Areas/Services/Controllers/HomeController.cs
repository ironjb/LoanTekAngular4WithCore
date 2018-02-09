using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace LoanTekAngular4WithCore.Areas.Services.Controllers
{
	[Area("Services")]
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

		public IActionResult GetLoggedInUserInfo()
		{
			var userInfo = new
			{
				ActiveClientId = 13,
				ActiveUserId = 44,
				ClientId = 5,
				UserId = 1940,
				IsRole = new
				{
					LoanTekAdmin = true,
					ClientAdmin = true,
					ClientSalesAdmin = true,
					ClientUser = true,
					ClientUserLMOnly = true
				},
				Role = "LoanTekAdmin"
			};
			return Ok(userInfo);
		}
	}
}
