import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Mock WUSD
  const Token = await hre.ethers.getContractFactory("MockWUSD");
  const token = await Token.deploy();
  await token.waitForDeployment();
  console.log("MockWUSD deployed to:", await token.getAddress());

  // Deploy Reputation
  const Reputation = await hre.ethers.getContractFactory("Reputation");
  const reputation = await Reputation.deploy();
  await reputation.waitForDeployment();
  console.log("Reputation deployed to:", await reputation.getAddress());
  
  // Deploy AuditLog
  const AuditLog = await hre.ethers.getContractFactory("AuditLog");
  const auditLog = await AuditLog.deploy();
  await auditLog.waitForDeployment();
  console.log("AuditLog deployed to:", await auditLog.getAddress());

  // Deploy Escrow
  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(await token.getAddress());
  await escrow.waitForDeployment();
  console.log("Escrow deployed to:", await escrow.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
