﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace LoanTekAngular4WithCore.Areas.Services.Controllers
{
	[Area("Services")]
	public class ClientManagerController : Controller
    {
		public IActionResult Index()
		{
			return View();
		}

		public IActionResult PrintReceipt()
		{
			return View();
		}
	}
}