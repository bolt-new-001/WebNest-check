export const emailTemplates = {
  projectUpdate: (projectTitle, updateMessage) => ({
    subject: `Project Update: ${projectTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #007bff; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Project Update</h1>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #333;">${projectTitle}</h2>
          <p style="color: #666; line-height: 1.6;">${updateMessage}</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.FRONTEND_URL}/projects" 
               style="background-color: #007bff; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              View Project
            </a>
          </div>
        </div>
      </div>
    `
  }),

  revisionRequest: (projectTitle, revisionTitle) => ({
    subject: `Revision Request: ${projectTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #ffc107; color: #333; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Revision Request</h1>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #333;">${projectTitle}</h2>
          <p style="color: #666; line-height: 1.6;">
            A new revision has been requested: <strong>${revisionTitle}</strong>
          </p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.FRONTEND_URL}/developer/projects" 
               style="background-color: #ffc107; color: #333; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              View Revision
            </a>
          </div>
        </div>
      </div>
    `
  }),

  milestoneCompleted: (projectTitle, milestoneTitle) => ({
    subject: `Milestone Completed: ${milestoneTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #28a745; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">🎉 Milestone Completed!</h1>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #333;">${projectTitle}</h2>
          <p style="color: #666; line-height: 1.6;">
            Great news! The milestone "<strong>${milestoneTitle}</strong>" has been completed.
          </p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.FRONTEND_URL}/projects" 
               style="background-color: #28a745; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Review Milestone
            </a>
          </div>
        </div>
      </div>
    `
  })
};