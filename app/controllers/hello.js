const models = require("../models");

const Profile = models.Profile;
const ProfileRevision = models.ProfileRevision;

const create = async () =>{
	await ProfileRevision.create({
		profile_uuid: "98961c20-bb7f-49a9-bbc8-803642029b04",
		data: {}
	})
}
create()
