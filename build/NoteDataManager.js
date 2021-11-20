"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const defaultPath_1 = require("./defaultPath");
const utils_1 = require("./utils");
const getNewNoteDataObject = () => ({
    categories: {},
    notes: {},
});
class NoteDataManager {
    constructor(filepath) {
        this.getNoteData = (filepath) => {
            const path = filepath !== null && filepath !== void 0 ? filepath : this.path;
            const isExists = fs_1.default.existsSync(path);
            if (!isExists) {
                console.warn("No NoteFile on this path, creating new");
                return getNewNoteDataObject();
            }
            let rawData = fs_1.default.readFileSync(path);
            let notesData = JSON.parse(rawData.toString());
            return notesData;
        };
        this.writeNoteData = (filepath) => {
            filepath !== null && filepath !== void 0 ? filepath : (filepath = this.path);
            const dirpath = path_1.default.dirname(filepath.toString());
            if (!fs_1.default.existsSync(dirpath))
                fs_1.default.mkdirSync(dirpath, { recursive: true });
            fs_1.default.writeFileSync(filepath, JSON.stringify(this.data));
        };
        this.addNewNoteToData = (note, forceBehavior = false) => {
            this.data.notes[note.id] = note;
            if (note.category) {
                if (this.data.categories[note.category]) {
                    this.data.categories[note.category].notes.push(note.id);
                }
                else {
                    throw new Error("There is no such a category");
                }
            }
        };
        this.addNewCategoryToData = (category) => {
            if (this.data.categories[category.name])
                throw new Error("Category already exists");
            this.data.categories[category.name] = category;
        };
        this.path = filepath !== null && filepath !== void 0 ? filepath : defaultPath_1.appData;
        this.data = this.getNoteData();
        (0, utils_1.log)("DATA: ", this.data);
    }
}
exports.default = NoteDataManager;
