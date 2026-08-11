const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Helper for running SQL with promises
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize schema and seed data
async function initDatabase() {
  db.serialize(async () => {
    // Admin Table
    db.run(`CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )`);

    // Profile Table
    db.run(`CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      location TEXT,
      email TEXT,
      phone TEXT,
      linkedin TEXT,
      github TEXT,
      bio TEXT,
      short_intro TEXT,
      photo_url TEXT
    )`);

    // Education Table
    db.run(`CREATE TABLE IF NOT EXISTS education (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      degree TEXT NOT NULL,
      institution TEXT NOT NULL,
      year_status TEXT NOT NULL,
      details TEXT
    )`);

    // Skills Table
    db.run(`CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      level TEXT NOT NULL,
      icon TEXT
    )`);

    // Projects Table
    db.run(`CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      problem_statement TEXT,
      objective TEXT,
      methodology TEXT,
      components_tools TEXT,
      key_features TEXT,
      result_outcome TEXT,
      category TEXT,
      project_date TEXT,
      github_link TEXT,
      demo_link TEXT,
      image_url TEXT,
      attachments_json TEXT
    )`);

    // Certificates Table
    db.run(`CREATE TABLE IF NOT EXISTS certificates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      issuer TEXT NOT NULL,
      date TEXT,
      description TEXT,
      file_url TEXT,
      credential_url TEXT
    )`);

    // Achievements Table
    db.run(`CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT,
      file_url TEXT
    )`);

    // Internships Table
    db.run(`CREATE TABLE IF NOT EXISTS internships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title_role TEXT NOT NULL,
      organization TEXT NOT NULL,
      location TEXT,
      duration TEXT,
      description TEXT,
      skills_learned TEXT,
      report_url TEXT,
      images_json TEXT
    )`);

    // Resume Table
    db.run(`CREATE TABLE IF NOT EXISTS resume (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_url TEXT NOT NULL,
      original_name TEXT,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Contact Messages Table
    db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Seed Admin user if empty
    const adminCount = await getQuery(`SELECT COUNT(*) as count FROM admin`);
    if (adminCount.count === 0) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('admin123', salt);
      await runQuery(`INSERT INTO admin (username, password_hash) VALUES (?, ?)`, ['admin', hash]);
      console.log('Seeded default admin user (admin / admin123)');
    }

    // Seed Profile if empty
    const profileCount = await getQuery(`SELECT COUNT(*) as count FROM profile`);
    if (profileCount.count === 0) {
      await runQuery(
        `INSERT INTO profile (name, role, location, email, phone, linkedin, github, bio, short_intro, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'Dhayalan R',
          'Mechanical Engineering Student & SolidWorks Learner',
          'Madurai, Tamil Nadu, India',
          'dhayalanr232@gmail.com',
          '8925314175',
          'https://linkedin.com/in/dhayalan-r',
          'https://github.com/dhayalan-r',
          'I am a 3rd-year Mechanical Engineering student at Alagappa Chettiar Government College of Engineering and Technology (ACGCET). I have a strong passion for 3D CAD modelling, mechanical component design, assembly analysis, and practical engineering problem solving.',
          'Passionate 3rd-year Mechanical Engineering student specializing in SolidWorks 3D modelling, mechanical design, and engineering prototyping.',
          ''
        ]
      );
      console.log('Seeded profile for Dhayalan R');
    }

    // Seed Education if empty
    const eduCount = await getQuery(`SELECT COUNT(*) as count FROM education`);
    if (eduCount.count === 0) {
      await runQuery(
        `INSERT INTO education (degree, institution, year_status, details) VALUES (?, ?, ?, ?)`,
        [
          'B.E. Mechanical Engineering',
          'Alagappa Chettiar Government College of Engineering and Technology',
          '3rd Year Student (2022 - 2026)',
          'Core Focus: Mechanical Design, SolidWorks CAD Modelling, Manufacturing Technology, Dynamics of Machinery, Thermal Engineering, and Fluid Mechanics.'
        ]
      );
      console.log('Seeded education data');
    }

    // Seed Skills if empty
    const skillCount = await getQuery(`SELECT COUNT(*) as count FROM skills`);
    if (skillCount.count === 0) {
      const defaultSkills = [
        ['SolidWorks', 'CAD / Design', 'Advanced', 'Layers'],
        ['3D Part Modelling', 'CAD / Design', 'Advanced', 'Box'],
        ['Assembly Modelling', 'CAD / Design', 'Advanced', 'Component'],
        ['Engineering Drawing', 'CAD / Design', 'Intermediate', 'FileText'],
        ['Mechanical Design', 'CAD / Design', 'Intermediate', 'Compass'],
        ['Mechanical Engineering Fundamentals', 'Engineering', 'Advanced', 'Cpu'],
        ['Manufacturing Basics', 'Engineering', 'Intermediate', 'Factory'],
        ['CNC Basics & Machining', 'Engineering', 'Intermediate', 'Settings'],
        ['Engineering Problem Solving', 'Engineering', 'Advanced', 'Wrench'],
        ['CAD Tools', 'Software / Tools', 'Advanced', 'Monitor'],
        ['Microsoft Office', 'Software / Tools', 'Advanced', 'FileSpreadsheet']
      ];
      for (const [name, category, level, icon] of defaultSkills) {
        await runQuery(`INSERT INTO skills (name, category, level, icon) VALUES (?, ?, ?, ?)`, [name, category, level, icon]);
      }
      console.log('Seeded skills data');
    }

    // Seed Projects if empty
    const projCount = await getQuery(`SELECT COUNT(*) as count FROM projects`);
    if (projCount.count === 0) {
      await runQuery(
        `INSERT INTO projects (title, description, problem_statement, objective, methodology, components_tools, key_features, result_outcome, category, project_date, github_link, demo_link, image_url, attachments_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          '3D Assembly & Kinematic Study of 4-Cylinder Engine',
          'Full 3D CAD parametric modeling and dynamic mates assembly of a 4-cylinder internal combustion engine.',
          'Complex interference fits and alignment errors in mechanical engine components can lead to structural wear and failure.',
          'Design parametric 3D parts in SolidWorks, execute interference-free assembly, and simulate rotational kinematic motion.',
          'Modeled individual pistons, wrist pins, connecting rods, crankshaft, and engine block. Applied concentric and coincident assembly mates and ran motion analysis.',
          'SolidWorks 2023, Dynamic Mates, Collision Detection, Render Studio',
          'Interference detection report, dynamic motion simulation, exploded assembly drawings with bill of materials (BOM).',
          'Successfully achieved 100% interference-free multi-part assembly with smooth rotational kinematic simulation.',
          'CAD / Design',
          '2024-03-15',
          'https://github.com/dhayalan-r/ic-engine-cad',
          '',
          '',
          '[]'
        ]
      );

      await runQuery(
        `INSERT INTO projects (title, description, problem_statement, objective, methodology, components_tools, key_features, result_outcome, category, project_date, github_link, demo_link, image_url, attachments_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'Quick-Change Pneumatic CNC Workholding Fixture',
          'Modular mechanical fixture engineered to accelerate part load/unload cycles in CNC milling machines.',
          'Manual clamping mechanisms cause significant downtime and variable positioning tolerances during batch manufacturing.',
          'Develop an ergonomic, high-repeatability workholding fixture that minimizes setup time and maintains rigid clamping force.',
          'Analyzed machining force vectors, designed hardened alloy clamp jaws in SolidWorks, and verified strain limits under peak cutting loads.',
          'SolidWorks CAD, Engineering Mechanics, CNC Machining Standards',
          'Pneumatic quick-toggle clamp, replaceable hardened jaws, self-centering positioning pins.',
          'Reduced component loading cycle time by 40% and improved dimensional repeatability to within ±0.02 mm.',
          'Manufacturing & Design',
          '2024-01-20',
          'https://github.com/dhayalan-r/cnc-fixture-design',
          '',
          '',
          '[]'
        ]
      );
      console.log('Seeded projects data');
    }

    // Seed Certificates if empty
    const certCount = await getQuery(`SELECT COUNT(*) as count FROM certificates`);
    if (certCount.count === 0) {
      await runQuery(
        `INSERT INTO certificates (title, issuer, date, description, file_url, credential_url) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          'SolidWorks Mechanical Design Associate Course',
          'Dassault Systèmes / CAD Training Institute',
          '2023-11-10',
          'Comprehensive training covering parametric 3D part modelling, multi-component assembly, sheet metal basics, and technical drawing standards.',
          '',
          'https://my.solidworks.com'
        ]
      );
      await runQuery(
        `INSERT INTO certificates (title, issuer, date, description, file_url, credential_url) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          'CNC Machining & G-Code Automation Workshop',
          'Department of Mechanical Engineering, ACGCET',
          '2024-02-05',
          'Hands-on workshop on CNC lathe programming, tool offset setting, G-code / M-code syntax, and production safety protocols.',
          '',
          ''
        ]
      );
      console.log('Seeded certificates data');
    }

    // Seed Achievements if empty
    const achCount = await getQuery(`SELECT COUNT(*) as count FROM achievements`);
    if (achCount.count === 0) {
      await runQuery(
        `INSERT INTO achievements (title, description, date, file_url) VALUES (?, ?, ?, ?)`,
        [
          '1st Place - CAD Modelling Speed Challenge',
          'Secured 1st rank in the inter-college CAD design competition by accurately modeling a complex mechanical gear housing under 3 hours.',
          '2024-02-18',
          ''
        ]
      );
      await runQuery(
        `INSERT INTO achievements (title, description, date, file_url) VALUES (?, ?, ?, ?)`,
        [
          'Active Student Coordinator - Society of Mechanical Engineers',
          'Organized peer learning sessions on 3D CAD modeling and SolidWorks design fundamentals for 1st & 2nd-year engineering students.',
          '2023-09-01',
          ''
        ]
      );
      console.log('Seeded achievements data');
    }

    // Seed Internships if empty
    const internCount = await getQuery(`SELECT COUNT(*) as count FROM internships`);
    if (internCount.count === 0) {
      await runQuery(
        `INSERT INTO internships (title_role, organization, location, duration, description, skills_learned, report_url, images_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'Mechanical Engineering In-Plant Trainee',
          'Regional Precision Machine Works',
          'Madurai, Tamil Nadu',
          'June 2024 - July 2024 (1 Month)',
          'Completed hands-on industrial internship focused on lathe turning, CNC milling, precision measurement, quality control, and industrial assembly processes.',
          'Precision Measurement (Vernier Caliper, Micrometer, Dial Gauge), Machine Tool Operation, Blueprint Interpretation, Shop Floor Safety Standards',
          '',
          '[]'
        ]
      );
      console.log('Seeded internship data');
    }
  });
}

initDatabase();

module.exports = {
  db,
  runQuery,
  getQuery,
  allQuery
};
