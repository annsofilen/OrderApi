import chalk from 'chalk';
import Order from '../models/OrderModel.js';
import MongooseProductManager from './MongooseProductManager.js';

class MongooseAPIManager {
    constructor() {
        // For note manager, so that we remember the class used 
        this.OrderModel = Order;
        this.MongooseProductManager = new MongooseProductManager()
    }

    async initialize(app = null) {
        // No Initialization required in this class
        // return stats if somebody whants to check
        return true;
    }

    async fetchAllOrders() {
        try {
            //pickout the user.id
            const allOrders = await this.OrderModel.find({});
            // Convert mongoose _id to id
            const allOrderObjects = allOrders.map(element => {
                return element.toObject()
            })
            console.log(chalk.blueBright.inverse('All orders loaded'));
            return allOrderObjects
        } catch (e) {
            console.log(chalk.blueBright.inverse('Empty notes loaded'));
            return []
        }
    } catch(error) {

    }



    async addOrder() {
        const newOrder = {
            //belongsTo: user.id
        };
        // Here we get a database document back, we like to return a POJO, plain javascript object back so we stay neutral to the db tech.
        const addedOrderDocument = await this.OrderModel.create(newOrder);

        if (addedOrderDocument) {
            console.log(chalk.green.inverse('New order added!'));
            // Convert from Mongoose to plain object
            const savedOrder = addedOrderDocument.toObject();
            return savedOrder;
        } else
            console.log(chalk.red.inverse('Error in db creating the new order!'))
        // here when something wrong
        return null;

    }

    async deleteOrder(id) {
        // On a query we can use lean to get a plain javascript object
        // Use mongoose criteria for id and belongsTo user
        //pick user.id
        //console.log('id of order to delete: ' + id)

        const result = await this.OrderModel.deleteOne({ _id: id });
        await this.MongooseProductManager.deleteProductOfOrderId(id)

        if (result.deletedCount === 1) {
            console.log("Order deleted successfully")
        } else {
            console.log("Order not found successfully")
        }

    }

    // async addOrder() {
    //     // Check that we have a selected user
    //     if (user) {
    //         // The uniqueness for the title is now per user!
    //         //pickout the user.id
    //         const haveDuplicateNote = await this.OrderModel.findOne({ belongsTo: user.id, title }).lean();
    //         if (!haveDuplicateNote) {
    //             const newOrder = {
    //                 title: title, // or shorter just title
    //                 belongsTo: user.id
    //             };
    //             // Here we get a database document back, we like to return a POJO, plain javascript object back so we stay neutral to the db tech.
    //             const addedNoteDocument = await this.NoteModel.create(newNote);

    //             if (addedNoteDocument) {
    //                 console.log(chalk.green.inverse('New note added!'));
    //                 // Convert from Mongoose to plain object
    //                 const savedNote = addedNoteDocument.toObject();
    //                 return savedNote;
    //             } else
    //                 console.log(chalk.red.inverse('Error in db creating the new note!'))
    //         } else
    //             console.log(chalk.red.inverse('Note title taken!'))
    //     } else
    //         console.log(chalk.red.inverse('No user given!'))

    //     // here when something wrong
    //     return null;

    // }







    async fetchNotes(user) {
        try {
            // No lean here so we can use toObject
            //pickout the user.id
            const allNotesBelongingToUser = await this.OrderModel.find({ belongsTo: user.id });
            // Convert mongoose _id to id
            const allNoteObjects = allNotesBelongingToUser.map(element => {
                return element.toObject()
            })
            console.log(chalk.blueBright.inverse('All notes loaded'));
            return allNoteObjects
        } catch (e) {
            console.log(chalk.blueBright.inverse('Empty notes loaded'));
            return []
        }
    }

    async addNote(user, title, body) {
        // Check that we have a selected user
        if (user) {
            // The uniqueness for the title is now per user!
            //pickout the user.id
            const haveDuplicateNote = await this.OrderModel.findOne({ belongsTo: user.id, title }).lean();
            if (!haveDuplicateNote) {
                const newNote = {
                    title: title, // or shorter just title
                    body: body,  // or shorter just body
                    belongsTo: user.id
                };
                // Here we get a database document back, we like to return a POJO, plain javascript object back so we stay neutral to the db tech.
                const addedNoteDocument = await this.NoteModel.create(newNote);

                if (addedNoteDocument) {
                    console.log(chalk.green.inverse('New note added!'));
                    // Convert from Mongoose to plain object
                    const savedNote = addedNoteDocument.toObject();
                    return savedNote;
                } else
                    console.log(chalk.red.inverse('Error in db creating the new note!'))
            } else
                console.log(chalk.red.inverse('Note title taken!'))
        } else
            console.log(chalk.red.inverse('No user given!'))

        // here when something wrong
        return null;

    }

    async removeNote(user, id) {
        // The uniqueness for the note is id! Then check if user same as belongsTo
        // The populate is mongoose way of filling in the data for the child property,
        // in this case the 'belongsTo' property, when executing the query
        const selectedNoteById = await this.NoteModel.findById(id).populate('belongsTo');

        if (selectedNoteById) {
            // Here we security check that this note really belongs to the user!
            // How would YOU do if the user is the admin user? 
            if (selectedNoteById.belongsTo.id == user.id) {
                const removedNoteDocument = await this.NoteModel.findByIdAndDelete(id);
                console.log(chalk.green.inverse('Note removed!' + removedNoteDocument));
                return removedNoteDocument.toObject();
            } else {
                console.log(chalk.red.inverse(`Note id and user do not correlate! No deletion made!`))
                return null;
            }
        } else {
            console.log(chalk.red.inverse(`No note found with id = ${id} !`))
            return null;
        }
    }

    async changeNote(user, note) {

        // Here we need to get the full document to be able to do save
        // Here we use mongoose to only select the combination of id and user, ie secured access
        // No lean() here so that we can use save
        //pick user.id
        const noteToChangeDocument = await this.NoteModel.findOne({ _id: note.id, belongsTo: user.id });

        if (noteToChangeDocument) {

            // The title should be unique for user so check so that we do not already have
            // for this user a document with this title!
            const oldTitle = noteToChangeDocument.title;
            // check so that we dont have an other note title with the same new title
            let sameTitleNote = null;
            if (oldTitle != note.title)
                //pick user.id
                sameTitleNote = await this.NoteModel.findOne({ title: note.title, belongsTo: user.id });

            if (!sameTitleNote) {
                // It is ok to change title for user
                noteToChangeDocument.title = note.title;
                noteToChangeDocument.body = note.body;
                console.log(chalk.green.inverse('Note changed!'));

                const changedNoteDocument = await noteToChangeDocument.save();
                //Give back the changed as plain object
                return changedNoteDocument.toObject();
            } else
                console.log(chalk.red.inverse('Note with same title exists for this user!'))

        } else
            console.log(chalk.red.inverse('Note to change not found!'))

        // all paths except success comes here
        return null;
    }


    async getNoteById(user, id) {
        // On a query we can use lean to get a plain javascript object
        // Use mongoose criteria for id and belongsTo user
        //pick user.id
        const foundNote = await this.NoteModel.findOne({ _id: id, belongsTo: user.id });

        if (foundNote) {
            console.log(chalk.green.inverse('Got note: ' + foundNote.title + ':' + foundNote.body));
            // Convert to POJO
            return foundNote.toObject();
        } else {
            console.log(chalk.red.inverse(`Note not found with id =${id} !`))
        }

        return null;
    }

}

export default MongooseAPIManager;