"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notes = void 0;
const chalk_1 = __importDefault(require("chalk"));
const NoteDataManager_1 = __importDefault(require("./NoteDataManager"));
const notes_1 = require("./notes");
const utils_1 = require("./utils");
class Notes {
    constructor(filepath) {
        this.getNotes = (args) => {
            var _a;
            const category = args.list;
            const id = (_a = args.id) !== null && _a !== void 0 ? _a : args._[0];
            if (category) {
                (0, utils_1.log)("Notes in category [ " + chalk_1.default.blue(category) + " ]");
                const categoryData = this._noteDataManager.data.categories[category];
                if (!categoryData)
                    throw new Error("Seems lika a wrong category...");
                return categoryData.notes.map((noteId) => this.getNote(noteId));
            }
            if (id) {
                (0, utils_1.log)("Note with id [ " + chalk_1.default.magenta(id) + " ]");
                return this.getNote(id);
            }
            (0, utils_1.log)("Dumping everything: ");
            return this._noteDataManager.data;
        };
        this.getNote = (id) => {
            const note = this._noteDataManager.data.notes[id];
            if (!note)
                throw new Error("There is no note with a such ID");
            return note;
        };
        this.createNewNote = (args) => {
            const { title, details, category, force } = args;
            if (!title)
                throw new Error("Note title is not provided");
            const note = new notes_1.Note({ title, details, category });
            this._noteDataManager.addNewNoteToData(note, force);
            (0, utils_1.log)("Noted!", note);
        };
        this.createNewCategory = (args) => {
            if (!args.newCategory)
                throw new Error("New category without a name? Wow...");
            const newCategory = { name: args.newCategory, notes: [] };
            this._noteDataManager.addNewCategoryToData(newCategory);
        };
        this._noteDataManager = new NoteDataManager_1.default(filepath);
        this.save = this._noteDataManager.writeNoteData;
    }
}
exports.Notes = Notes;
