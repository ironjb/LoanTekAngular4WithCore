using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LoanTekAngular4WithCore.Areas.Services.Models;

namespace LoanTekAngular4WithCore.Areas.Services.Data
{
	public class BranchUserDataStore
	{
		public static BranchUserDataStore Current { get; } = new BranchUserDataStore();

		public List<BranchUserDto> BranchUsers { get; set; }

		public BranchUserDataStore()
		{
			BranchUsers = new List<BranchUserDto>() {
				// new BranchUserDto() { UserId = 1, FullName = "Garner Whitley",Email = "garnerwhitley@andershun.com"},
				// new BranchUserDto() { UserId = 2, FullName = "Rodriguez Baker",Email = "rodriguezbaker@andershun.com"},
				// new BranchUserDto() { UserId = 3, FullName = "Cook Stewart",Email = "cookstewart@andershun.com"},
				// new BranchUserDto() { UserId = 4, FullName = "Paul Mccall",Email = "paulmccall@andershun.com"},
				// new BranchUserDto() { UserId = 5, FullName = "Lucille Mckinney",Email = "lucillemckinney@andershun.com"},
				// new BranchUserDto() { UserId = 6, FullName = "Alyce Fletcher",Email = "alycefletcher@andershun.com"},
				// new BranchUserDto() { UserId = 7, FullName = "Carolina Ray",Email = "carolinaray@andershun.com"},
				// new BranchUserDto() { UserId = 8, FullName = "Bettie Rodriquez",Email = "bettierodriquez@andershun.com"},
				// new BranchUserDto() { UserId = 9, FullName = "Christie Lester",Email = "christielester@andershun.com"},
				// new BranchUserDto() { UserId = 10, FullName = "Cindy Aguirre",Email = "cindyaguirre@andershun.com"},
				// new BranchUserDto() { UserId = 11, FullName = "Browning Cantu",Email = "browningcantu@andershun.com"}
			};
		}
	}
}
