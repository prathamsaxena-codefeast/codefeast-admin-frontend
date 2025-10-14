export const contactForm = [
            {
              key: "email" as const,
              label: "Email",
              placeholder: "name@example.com",
              type: "email" as const,
            },
            {
              key: "phoneNumber" as const,
              label: "Phone number",
              placeholder: "e.g., +1 555 123 4567",
              type: "text" as const,
            },
            {
              key: "address" as const,
              label: "Address",
              placeholder: "Street, City, Country",
              type: "text" as const,
            },
            {
              key: "resumeLink" as const,
              label: "Resume link",
              placeholder: "e.g., Google Drive or portfolio URL",
              type: "text" as const,
            },
          ]


          export const personalForm = [
            {
              key: "firstName" as const,
              label: "First name",
              placeholder: "e.g., Jane",
              type: "text" as const,
            },
            {
              key: "lastName" as const,
              label: "Last name",
              placeholder: "e.g., Doe",
              type: "text" as const,
            },
            {
              key: "age" as const,
              label: "Age",
              placeholder: "e.g., 28",
              type: "number" as const,
            },
          ]


          export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;