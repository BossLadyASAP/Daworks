import mysql from 'mysql2/promise';

// Get database URL from environment
const dbUrl = process.env.DATABASE_URL || 
              process.env.MYSQL_URL ||
              buildUrlFromEnv();

function buildUrlFromEnv() {
  const host = process.env.MYSQL_HOST || process.env.DB_HOST;
  const port = process.env.MYSQL_PORT || process.env.DB_PORT || "3306";
  const user = process.env.MYSQL_USER || process.env.DB_USER || "root";
  const password = process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD;
  const database = process.env.MYSQL_DATABASE || process.env.DB_NAME || "railway";

  if (host && password) {
    return `mysql://${user}:${password}@${host}:${port}/${database}`;
  }
  return null;
}

async function migrate() {
  if (!dbUrl) {
    console.error('❌ No database URL found in environment');
    process.exit(1);
  }

  try {
    // Parse the URL
    const url = new URL(dbUrl);
    const connection = await mysql.createConnection({
      host: url.hostname,
      port: url.port || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
    });

    console.log('✅ Connected to database');

    // Migration SQL
    const migrationSql = `
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` int AUTO_INCREMENT NOT NULL,
  \`email\` varchar(320) NOT NULL UNIQUE,
  \`passwordHash\` text NOT NULL,
  \`shopName\` varchar(255) NOT NULL,
  \`ownerName\` varchar(255) NOT NULL,
  \`phone\` varchar(20) NOT NULL,
  \`orangePhone\` varchar(20),
  \`mtnPhone\` varchar(20),
  \`role\` enum('user','admin') NOT NULL DEFAULT 'user',
  \`verified\` boolean NOT NULL DEFAULT false,
  \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(\`id\`)
);

CREATE TABLE IF NOT EXISTS \`products\` (
  \`id\` int AUTO_INCREMENT NOT NULL,
  \`userId\` int NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`description\` text,
  \`category\` varchar(100),
  \`costPrice\` decimal(10,2) NOT NULL,
  \`salePrice\` decimal(10,2) NOT NULL,
  \`stock\` int NOT NULL DEFAULT 0,
  \`imageUrl\` text,
  \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(\`id\`),
  FOREIGN KEY(\`userId\`) REFERENCES \`users\`(\`id\`)
);

CREATE TABLE IF NOT EXISTS \`orders\` (
  \`id\` int AUTO_INCREMENT NOT NULL,
  \`userId\` int NOT NULL,
  \`customerPhone\` varchar(20),
  \`status\` enum('pending','processing','completed','failed','cancelled') NOT NULL DEFAULT 'pending',
  \`paymentMethod\` enum('mtn','orange','cash') NOT NULL,
  \`totalAmount\` decimal(10,2) NOT NULL,
  \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(\`id\`),
  FOREIGN KEY(\`userId\`) REFERENCES \`users\`(\`id\`)
);

CREATE TABLE IF NOT EXISTS \`orderItems\` (
  \`id\` int AUTO_INCREMENT NOT NULL,
  \`orderId\` int NOT NULL,
  \`productId\` int NOT NULL,
  \`quantity\` int NOT NULL,
  \`unitPrice\` decimal(10,2) NOT NULL,
  \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(\`id\`),
  FOREIGN KEY(\`orderId\`) REFERENCES \`orders\`(\`id\`),
  FOREIGN KEY(\`productId\`) REFERENCES \`products\`(\`id\`)
);

CREATE TABLE IF NOT EXISTS \`transactions\` (
  \`id\` int AUTO_INCREMENT NOT NULL,
  \`userId\` int NOT NULL,
  \`orderId\` int,
  \`amount\` decimal(10,2) NOT NULL,
  \`operator\` enum('mtn','orange') NOT NULL,
  \`transactionStatus\` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
  \`reference\` varchar(255),
  \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(\`id\`),
  FOREIGN KEY(\`userId\`) REFERENCES \`users\`(\`id\`),
  FOREIGN KEY(\`orderId\`) REFERENCES \`orders\`(\`id\`)
);

CREATE TABLE IF NOT EXISTS \`notifications\` (
  \`id\` int AUTO_INCREMENT NOT NULL,
  \`userId\` int NOT NULL,
  \`title\` varchar(255) NOT NULL,
  \`message\` text NOT NULL,
  \`type\` enum('order','payment','stock','system') NOT NULL DEFAULT 'system',
  \`read\` boolean NOT NULL DEFAULT false,
  \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(\`id\`),
  FOREIGN KEY(\`userId\`) REFERENCES \`users\`(\`id\`)
);
    `;

    // Execute migration
    const statements = migrationSql.split(';').filter(s => s.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
        console.log('✅ Executed:', statement.substring(0, 50) + '...');
      }
    }

    console.log('✅ Migration completed successfully!');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();
