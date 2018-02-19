using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LoanTekAngular4WithCore.Areas.Services.Models
{
	public class BranchDto
	{
		public int BranchId { get; set; }
		// public int ClientId { get; set; }
		public string BranchName { get; set; }
		public List<BranchManagerDto> BranchManagers { get; set; }
		public List<BranchUserDto> BranchUsers { get; set; }
	}
}
