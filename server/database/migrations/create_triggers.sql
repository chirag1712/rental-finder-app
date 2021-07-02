USE honkForSublet;

DROP TRIGGER IF EXISTS UserPostingUpperBound;
DELIMITER //
CREATE TRIGGER UserPostingUpperBound BEFORE INSERT ON Posting
FOR EACH ROW
BEGIN
  IF
    (SELECT COUNT(*)
    FROM Posting AS p
    WHERE p.user_id = NEW.user_id) >= 3
  THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Exceeded number of postings per user (3)';
  END IF;
END;//
DELIMITER ;

DROP TRIGGER IF EXISTS PostingPhotoUpperBound;
DELIMITER //
CREATE TRIGGER PostingPhotoUpperBound BEFORE INSERT ON PostingPhoto
FOR EACH ROW
BEGIN
  IF
    (SELECT COUNT(*)
    FROM PostingPhoto AS ph
    WHERE ph.posting_id = NEW.posting_id) >= 10
  THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Exceeded number of photos per posting (10)';
  END IF;
END;//
DELIMITER ;