
USE [Maze.CodeFirst.MazeDataContracts]

   /****** Poplulate User Table With Some Fresh Users  ******/
    DECLARE @today datetime = getdate(); 
   	DELETE FROM [Maze.CodeFirst.MazeDataContracts].[dbo].[User]
   	SET IDENTITY_INSERT [Maze.CodeFirst.MazeDataContracts].[dbo].[User] ON
	
	INSERT INTO [Maze.CodeFirst.MazeDataContracts].[dbo].[User]
		( [Id], [Name] ,[Email] ,[JoinDate] ,[Password] )
	VALUES
		(1,'GuestUser','GuestUser@gmail.com',DATEADD(day,-1,@today),'1234'),
		(2,'James','James@gmail.com',DATEADD(minute,-4,@today),'1234'),
		(3,'Mary','Mary	@gmail.com',DATEADD(day,-5,@today),'1234'),
		(4,'John','John@gmail.com',DATEADD(hour,-6,@today),'1234'),
		(5,'Jennifer','Jennifer@gmail.com',DATEADD(day,-7,@today),'1234'),
		(6,'Michael','Michael@gmail.com',DATEADD(day,-8,@today),'1234'),
		(7,'Linda','Linda@gmail.com',DATEADD(day,-9,@today),'1234'),
		(8,'Barbara','Barbara@gmail.com',DATEADD(day,-10,@today),'1234'),
		(9,'Richard','Richard@gmail.com',DATEADD(month,-3,@today),'1234'),
		(10,'Susan','Susan@gmail.com',DATEADD(day,-12,@today),'1234'),
		(11,'Joseph','Joseph@gmail.com',DATEADD(day,-13,@today),'1234'),
		(12,'Ramone','ramone@gmail.com',DATEADD(month,-2,@today),'1234'),
		(13,'Thomas','Thomas@gmail.com',DATEADD(day,-15,@today),'1234'),
		(14,'Ramone','ramone@gmail.com',DATEADD(day,-16,@today),'1234'),
		(15,'Margaret','Margaret@gmail.com',DATEADD(day,-17,@today),'1234'),
		(16,'Charles','Charles@gmail.com',DATEADD(day,-18,@today),'1234'),
		(17,'Daniel','Daniel@gmail.com',DATEADD(day,-19,@today),'1234'),
		(18,'Nancy','Nancy@gmail.com',DATEADD(month,-1,@today),'1234'),
		(19,'Matthew','Matthew@gmail.com',DATEADD(year,-1,@today),'1234'),
		(20,'Betty','Betty@gmail.com',DATEADD(hour,-15,@today),'1234'),
		(21,'Anthony','Anthony@gmail.com',DATEADD(hour,-12,@today),'1234')
	SET IDENTITY_INSERT [Maze.CodeFirst.MazeDataContracts].[dbo].[User] OFF
								
	/****** Poplulate Maze Table With Some Fresh Mazes  ******/
 	DELETE FROM [Maze.CodeFirst.MazeDataContracts].[dbo].[Maze]  
    SET IDENTITY_INSERT [Maze.CodeFirst.MazeDataContracts].[dbo].[Maze] ON
	
	INSERT INTO [Maze.CodeFirst.MazeDataContracts].[dbo].[Maze]
		( [Id],[Hash] )
	VALUES
		 /****** These are all valid maze hashes generated previously  ******/
     	( 1, 'n=729d4b1b53c9efd25012b4db6e163a0ab2b19e51a962db2a154541b1aa991a916bb576f17256cacf6ca8b6aaa98d2a6a324b4957b2d94fa4995016ebefcc289165a2af9a9ab7ad182e93d34a5a3ad2caca1ad139&c=28&r=12&l=1' ),
		( 2, 'n=8a62d4bc6eac3522a9854cc64355b652765d296e31b556e89ab3ada6b1cc49141bb2d6fad2195924b7e6d51a2a92356acab4cdaa6a9b6e1a2a50c95cce6eb1dacb4d5292505115146deb543add6dcddacb92b5c0295a9b36c9cab1a6b364ce4a165663a656da6cae9a6191466595356a1b5db656caec53bccbc4549252a358aab694b31613b5ad665616472e7ebad2ca&c=36&r=16&l=1' ),
		( 3, 'n=6ad991ab65191695bb665b2999cac94b593b6951322bdcc9454551e2e548ad2fb1d65b5127921a5269b16f4c4991ede9bb1b18266aeb9aa129b396caa46c92b795b839d3592ab6ab9a4c2967454aacb559934b69&c=28&r=12&l=1'),
		( 4, 'n=932779559aaafb52a8265b29b568c94a48cb97253256abaa5444516e453991db49b5b7d2b732e8479a929eb25b5294b2ec3d1a8bc5c8b2565356719a368d31ae315babae3846476a775aa89ac49b52bceaeda510&c=28&r=12&l=1'),
		( 5, 'n=35ac22cb4598b57a6ad679da93c5183535b1379b299ab14b534768da5c9ba66be8b510aa96d70a362ce9d626e9b7b291aab499198e5ad3b150515551&c=20&r=12&l=1'),
		( 6, 'n=2a5612d6a9d9d93893e66b92652aaa54afa9a1565437b92a51451550f72a43502f4954f4ad5795d6a9d5b91627344556d9cd5ed869b36ab0672b28964e4cc65e6694796a6a554594b736d5160e5295fe93d456aa526c562479e559baaa956506471eaed0efd1aa5a&c=26&r=16&l=1'),
		( 7, 'n=966cb28eb6b52c6aaa9b471a52a99ce2ed2663187652ec96115515544d66a6d8b2992c6636b5cf9eaf52c69a46596cb07746469e8e6cd4e66593392ab35ac5b01ea95a9ee96b66922b649864a79ba596ca4e526a1a6c565e964365466e549b6a92756994564b4ebe&c=26&r=16&l=1'),
		( 8, 'n=73d1d598ce2f2e6a32b2b3269b529ac6cadab25aab732b6655145150a6aca1964f2b2eead5b55ef86ac99226c9a6ecc8b2ba26ba9b6196c2b36f3a4216a8caeed60732aa3ad92c96ea65a52a264d19ce2e2ce916a6c6d3349adabcc6314926baceb34a4a1a4c5966&c=26&r=16&l=1'),
		( 9, 'n=a6ad6296951a5ab3bab5d599d24c4895ebb26f269093985959eb5ad292526d1558abd6d9461a69ddb1a29b655aab96984ab65bb2aceaa74328155511&c=20&r=12&l=1'),
		( 10, 'n=8b995869656aae1b49d69db94bd36873b4c92e2d2bc58bb2bbb2a84bba485a896b926d996e466a26bacbb9b24a9aaa91e506ba1658493be5b9451541&c=20&r=12&l=1'),
		( 11, 'n=b6bbb82f0449a55559b1f6d94f554acc5551336d5996a6bb5ab4a2ca969a316ac96f4cb9cae5aa461b299725127bb2c1a52459979b6aba69a8451511&c=20&r=12&l=1'),
		( 12, 'n=ae4baaa532282f4ec9d6b55991c939b769ca2ea691ab14d946b52a7aad69499349b3f2d92d2c6ac71ba8362d6b3664ab6f962049b9b95b2b09454551&c=20&r=12&l=1'),
		( 13, 'n=99561592655aee5657a928d46e454b3699b572e461e4b5926795ac9a4a9c92a65753346a56b47566f295ab8eae351a52064ee2ee7652ac94aeccaa6e496693a2171516c655151454d757ac58ae57555eb85aab6a47b2499a52b96b266e2792cee79a54b0ab9956c228655abecf9b92c099ca563a5b3158c29e59b53893cd653655339548575c56d2ee635b362694e92c&c=36&r=16&l=1'),
		( 14, 'n=997bb2a78aa85b52aaa6b619954ceacd5e6a5793289a5a93554550b2d29a936ce895797975ab2a8e24c9b3ce4abab1b2aa96a80bda996964e9ae9a8b4aac52b2935a374589ab6d687633898e925b51b4e8b72589&c=28&r=12&l=1' ),
		( 15, 'n=af494a92754a9e9b5252615af61bb2a46a5a0e52bbea7a881544511792e87bb9296d3db9c9ab483344b1ae6b49995a5aebe158929551cd2f5a33b1684e96c3726c5aabc68b8e95395355aadab52216adb9e52b2a&c=28&r=12&l=1' ),
		( 16, 'n=dbcb4aa43ad26f4a584f33c971c6b29bea4a8e342933d5a94554514aa6b9e9a5a959dbba272eaa5acaa99a6a2b67aac8a412934f6c5852e6dbce312a66ad524f8b69664ca9d133aa5fa4a8e19b189bb1aa162d29&c=28&r=12&l=1' ),
		( 17, 'n=9a4bb94bd289d9b4b8339a499353c9c279ba6d6cb292a6aa551451d7464836b931d66de9a54bb99be48ab2ad381ba54971adcaae2a69b72b928e487a6ab34892996b6d9312eeb34a9314b0b5bd9a4fa648b19952&c=28&r=12&l=1' ),
		( 18, 'n=1f3a5993c969b535982fac69b22ecb57d6d14ea1326a4d4a4555516e389969c539daeee94b6d49e64d691a6b2bb2cccac5d32859d26acbb9aa6a2b2ac644b13e4d99251119a753c94ed2b2da362919cccbe19330&c=28&r=12&l=1' ),
		( 19, 'n=53d2e9b531192f9769d158ca52e6ea23a56b562ca95f2a91455151962d4976336a5d7b5295999ab265291eb74beaacd29b2498e1ce5a9b5168a65592b64d694d659a6ac959ea966aaa5acaa7b2609a95b9295b09&c=28&r=12&l=1' ),
		( 20, 'n=4bb458c6276b76149aaf55b0a9d4a94d146b2ab69bca4eca555050d3ed4a6e136aeebbd9ae6d11ae235a22ed3b2e0ac9ad6aa9abaa9927946a4e3b41994ad969d12a11a299ab5f49a762da2c2eaac750a8b9d692&c=28&r=12&l=1' )
    SET IDENTITY_INSERT [Maze.CodeFirst.MazeDataContracts].[dbo].[Maze] OFF


	/****** Poplulate Race Table With Some Fresh Races ******/
	DECLARE @today2 datetime = getdate(); 
	DELETE FROM [Maze.CodeFirst.MazeDataContracts].[dbo].[Race]
	SET IDENTITY_INSERT [Maze.CodeFirst.MazeDataContracts].[dbo].[Race] ON
	
	INSERT INTO [Maze.CodeFirst.MazeDataContracts].[dbo].[Race]
		( [Id], [MazeId] ,[UserId] ,[CompletionTime] ,[RaceDate] )
	VALUES
		(1,1,1,30.660,DATEADD(day,-1,@today2)),
		(2,2,2,35.756,DATEADD(minute,-4,@today2)),
		(3,3,3,29.960,DATEADD(day,-5,@today2)),
		(4,4,1,28.440,DATEADD(hour,-6,@today2)),
		(5,5,1,19.005,DATEADD(day,-7,@today2)),
		(6,6,4,33.680,DATEADD(day,-8,@today2)),
		(7,7,1,30.260,DATEADD(day,-9,@today2)),
		(8,8,1,37.060,DATEADD(day,-10,@today2)),
		(9,9,6,20.460,DATEADD(month,-3,@today2)),
		(10,15,21,21.767,DATEADD(day,-12,@today2)),
		(11,11,9,17.960,DATEADD(day,-13,@today2)),
		(12,12,1,50.555,DATEADD(month,-2,@today2)),
		(13,13,1,48.210,DATEADD(day,-15,@today2)),
		(14,14,5,24.310,DATEADD(day,-16,@today2)),
		(15,15,5,23.235,DATEADD(day,-17,@today2)),
		(16,16,1,30.333,DATEADD(day,-18,@today2)),
		(17,17,1,32.220,DATEADD(day,-19,@today2)),
		(18,18,19,23.620,DATEADD(month,-1,@today2)),
		(19,19,19,24.460,DATEADD(year,-1,@today2)),
		(20,6,20,45.160,DATEADD(hour,-15,@today2)),
		(21,13,1,46.360,DATEADD(hour,-12,@today2)),
		(22,15,1,19.660,DATEADD(day,-28,@today2))
	SET IDENTITY_INSERT [Maze.CodeFirst.MazeDataContracts].[dbo].[Race] OFF

	/****** Print out some results ******/
	SELECT 
		[Race].[Id] as 'Race Id',
		[User].[Name] as 'User',
		[Race].[CompletionTime] as 'Race Time',
		[Race].[RaceDate] as 'Race Date',
		[Maze].[Hash] as 'Maze'

	FROM [Maze.CodeFirst.MazeDataContracts].[dbo].[Race] 
		left join [Maze.CodeFirst.MazeDataContracts].[dbo].[User] on [Race].[UserId]=[User].[Id]
	    left join [Maze.CodeFirst.MazeDataContracts].[dbo].[Maze] on [Race].[MazeId]=[Maze].[Id]