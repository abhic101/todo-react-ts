interface TodoTask {
    _id?: string;
    task_name: string;
    task_details?: string;
    status: boolean;
}

const todoTasksSample: TodoTask[] = [
  {
    _id: "60d5f484f1a2c8b1f8e4e1a1",
    task_name: "Complete project documentation",
    task_details: `<p>this is some task that i want to do</p>
<ul>
<li>dsajl;kjfd</li>
<li>dj;laskjf</li>
<li>sakdjlf&nbsp;</li>
</ul>`,
    status: false
  },
  {
    _id: "60d5f484f1a2c8b1f8e4e1a2",
    task_name: "Review pull requests",
    task_details: "Review and merge pending PRs from the team, focusing on the authentication module and user management features",
    status: true
  },
  {
    _id: "60d5f484f1a2c8b1f8e4e1a3",
    task_name: "Set up CI/CD pipeline",
    task_details: "Configure GitHub Actions for automated testing, building, and deployment to staging environment",
    status: false
  },
  {
    _id: "60d5f484f1a2c8b1f8e4e1a4",
    task_name: "Update dependencies",
    status: true
  },
  {
    _id: "60d5f484f1a2c8b1f8e4e1a5",
    task_name: "Fix navigation bug",
    task_details: "Mobile navigation menu doesn't close when clicking outside. Implement click outside handler",
    status: false
  },
  {
    _id: "60d5f484f1a2c8b1f8e4e1a6",
    task_name: "Write unit tests",
    task_details: "Add unit tests for user service, auth middleware, and validation utilities. Aim for 80% coverage",
    status: false
  },
  {
    _id: "60d5f484f1a2c8b1f8e4e1a7",
    task_name: "Optimize database queries",
    status: true
  },
  {
    _id: "60d5f484f1a2c8b1f8e4e1a8",
    task_name: "Design landing page",
    task_details: "Create mockups for the new landing page with hero section, features grid, and pricing table",
    status: false
  },
  {
    _id: "60d5f484f1a2c8b1f8e4e1a9",
    task_name: "Setup email notifications",
    task_details: "Configure email service for password reset, welcome emails, and notification alerts using SendGrid",
    status: false
  },
  {
    _id: "60d5f484f1a2c8b1f8e4e1b0",
    task_name: "Refactor user interface",
    task_details: "Migrate class components to functional components with hooks. Implement proper TypeScript types throughout",
    status: true
  },
];

export {
    todoTasksSample
}

export type {
    TodoTask
}