-- CreateTable
CREATE TABLE "_UserSavedUniversities" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserSavedUniversities_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserSavedUniversities_B_index" ON "_UserSavedUniversities"("B");
