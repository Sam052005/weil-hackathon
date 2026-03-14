import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("Escrow Integration", function () {
  let token, escrow, buyer, seller, deployer;
  const AMOUNT = ethers.parseUnits("100", 18);

  beforeEach(async function () {
    [deployer, buyer, seller] = await ethers.getSigners();
    
    // Deploy MockWUSD
    const Token = await ethers.getContractFactory("MockWUSD");
    token = await Token.deploy();
    
    // Deploy Escrow
    const Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy(await token.getAddress());

    // Give buyer some tokens
    await token.mint(buyer.address, AMOUNT * 2n);
    // Approve escrow
    await token.connect(buyer).approve(await escrow.getAddress(), AMOUNT * 2n);
  });

  it("Should create, fund, and complete an escrow securely", async function () {
    const tx = await escrow.connect(buyer).createTransaction(seller.address, AMOUNT);
    const receipt = await tx.wait();
    
    await escrow.connect(buyer).fundEscrow(0);
    expect(await token.balanceOf(await escrow.getAddress())).to.equal(AMOUNT);

    await escrow.connect(deployer).releaseFunds(0); // owner or buyer can release
    expect(await token.balanceOf(seller.address)).to.equal(AMOUNT);
  });
});
