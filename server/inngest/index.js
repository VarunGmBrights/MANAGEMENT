import { Prisma } from "@prisma/client";
import { Inngest } from "inngest";
import prisma from "../configs/prisma.js"

// client to send and receive events
export const inngest = new Inngest({ id: "project-management" });


                    //USERS
  
const syncUserCreation = inngest.createFunction(
    {id : 'sync-user-from-clerk'},
    {event : 'clerk/user.created'},
    async ({event}) => {
        const {data} = event
        await prisma.user.create({
            data: {
                id:data.id,
                email:data?.email_addresses[0]?.email_address,
                name:data?.first_name + " " + data?.last_name,
                image: data?.image_url, 
            }
        })

    }
)



//deleet user
const syncUserDeletion = inngest.createFunction(
    {id : 'delete-user-with-clerk'},
    {event : 'clerk/user.deleted'},
    async ({event}) => {
        const {data} = event
        await prisma.user.delete({
            where: {
                id: data.id,
            }
        })

    }
)

//update user

const syncUserUpdation = inngest.createFunction(
    {id : 'update-user-from-clerk'},
    {event : 'clerk/user.updated'},
    async ({event}) => {
        const {data} = event
        await prisma.user.update({
            where: {
                id:data.id
            },
            data: {
                
                email:data?.email_addresses[0]?.email_addres,
                name:data?.first_name + " " + data?.last_name,
                image: data?.image_url, 
            }
        })

    }
)
                //WORKSPACE 

//save workspace data to database 

const syncWrokspaceCreation = inngest.createFunction(
    {id: 'sync-workspace-from-clerk'},
    {event: 'clerk/orgnization.created'},
    async ({event}) => {
         const {data} = event;
         await prisma.workspace.create({
            data: {
                id: data.id,
                name : data.name,
                slug : data.slug,
                ownerId: data.created_by,
                image_url: data.image_url
            }
         })

         //add Admin

         await prisma.workspaceMember.create({
            data: {
                userId: data.created_by,
                workspaceId : data.id,
                role: "ADMIN"
            }
         })
    }
)

//update workspace data in database
const syncWrokspaceUpdation  = inngest.createFunction(
    {id: 'update-workspace-from-clerk'},
    {event: 'clerk/orgnization.updated'},
    async ({ event }) => {
        const { data } = event;
        await prisma.workspace.update({
            where : {
                id: data.id
            },
            data: {
                name : data.name,
                slug : data.slug,
                image_url: data.image_url
            }
        })
    }
)

//delete workspace data in database
const syncWrokspaceDeletion  = inngest.createFunction(
    {id: 'delete-workspace-from-clerk'},
    {event: 'clerk/orgnization.deleted'},
    async ({event }) => {
        const { data } = event;
        await prisma.workspace.delete({
            where : {
             id: data.id
            }
        })
    }
)

//save workspace member data in databse

const syncWrokspaceMemberCreation =  inngest.createFunction(
    {id : 'sync-workspace-member-from-clerk'},
    {event: 'clerk/organizationInvitation.accepted'},
    async ({event}) => {
        const { data } = event;
        await prisma.workspaceMember.create({
              data: {
                userId: data.user_id,
                workspaceId : data.organization_id,
                role: String(data.role_name).toUpperCase(),

              }
        })
    }
)

export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    syncWrokspaceCreation,
    syncWrokspaceUpdation,
    syncWrokspaceDeletion,
    syncWrokspaceMemberCreation

];